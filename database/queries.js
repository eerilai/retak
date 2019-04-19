const Sequelize = require('sequelize');
const { User, Game, AsyncGame } = require('./index');
const { hashPassword, comparePassword } = require('./encryptionHelpers');

const { Op } = Sequelize;

const findUserLocal = (usernameOrEmail, password) => new Promise((resolve, reject) => {
  User.findOne({
    where: {
      [Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  })
    .then((user) => {
      comparePassword(password, user.password)
        .then(() => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    })
    .catch((err) => {
      reject(err);
    });
});

const findUserById = id => new Promise((resolve, reject) => {
  User.findById(id)
    .then((user) => {
      resolve(user);
    })
    .catch((err) => {
      reject(err);
    });
});

const findOrCreateUserByOauth = options => new Promise((resolve, reject) => {
  User.findOrCreate({
    where: options,
    defaults: {
      username: `Tak-user-${Math.random().toString(36).slice(2, 9)}`,
    },
  })
    .then(([user, created]) => {
      resolve(user);
    })
    .catch((err) => {
      reject(err);
    });
});

const createUser = userInfo => new Promise((resolve, reject) => {
  const { username, email, password } = userInfo;
  hashPassword(password)
    .then((hash) => {
      User.create({
        username,
        email,
        password: hash,
      })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    })
    .catch((err) => {
      reject(err);
    });
});

const logGame = gameInfo => new Promise(async (res, rej) => {
  const { player1, player2, size, winType, victor, ptn, tps } = gameInfo;
  let { ranked } = gameInfo;
  let player1_id = null;
  let player2_id = null;
  try {
    const p1 = await User.findAll({ where: { username: player1 } });
    const p2 = await User.findAll({ where: { username: player2 } });
    player1_id = p1[0] ? p1[0].dataValues.id : null;
    player2_id = p2[0] ? p2[0].dataValues.id : null;
  } catch (err) {
    console.error(err);
  }
  if (player1_id && player2_id) ranked = true;
  Game.create({
    player1,
    player1_id,
    player2,
    player2_id,
    ptn,
    victor,
    board_state: tps,
    win_type: winType,
    board_size: size,
    ranked,
  });
  if (player1_id !== null) {
    User.increment('total_games', { where: { id: player1_id } });
    if (ranked === true && player1 === victor) {
      User.increment(['ranked_games', 'ranked_wins'], { where: { id: player1_id } });
    } else if (ranked === true) {
      User.increment(['ranked_games', 'ranked_losses'], { where: { id: player1_id } });
    }
  }
  if (player2_id !== null) {
    User.increment('total_games', { where: { id: player2_id } });
    if (ranked === true && player2 === victor) {
      User.increment(['ranked_games', 'ranked_wins'], { where: { id: player2_id } });
    } else if (ranked === true) {
      User.increment(['ranked_games', 'ranked_losses'], { where: { id: player2_id } });
    }
  }
});

const getLeaderboard = () => new Promise(async (res, rej) => {
  const board = await User.findAll({
    attributes: ['username', 'total_games', 'ranked_games', 'ranked_wins', 'ranked_losses'],
    order: [['ranked_wins', 'DESC']],
  });
  res(board);
});

const getUserData = username => new Promise(async (res, rej) => {
  const data = await User.find({
    attributes: [
      'id',
      'username',
      'email',
      'total_games',
      'ranked_games',
      'ranked_wins',
      'ranked_losses',
      'createdAt',
    ],
    where: {
      username,
    },
  });
  res(data);
});

const getUserGames = username => new Promise(async (res, rej) => {
  const games = await Game.findAll({
    where: {
      [Op.or]: [
        { player1: username },
        { player2: username },
      ],
    },
  });
  res(games);
});

const getCurrentUserGames = userID => new Promise(async (res, rej) => {
  if (userID) {
    const games = await AsyncGame.findAll({
      where: {
        [Op.or]: [
          { player1_id: userID },
          { player2_id: userID },
        ],
      },
    });
    res(games);
  } else {
    rej(userID);
  }
});

const storeAsyncGame = (gameState, room, roomId) => {
  const { tps, ptn, ranked } = gameState;
  // console.log(room);
  const { player1, player2, boardSize, activePlayer } = room;
  return new Promise(async (res, rej) => {
    const p1 = await User.findAll({ where: { username: player1 } });
    const p2 = await User.findAll({ where: { username: player2 } });
    player1_id = p1[0] ? p1[0].dataValues.id : null;
    player2_id = p2[0] ? p2[0].dataValues.id : null;

    AsyncGame.findOrCreate({
      where: {
        room_id: roomId,
      },
      defaults: {
        player1,
        player1_id,
        player2,
        player2_id,
        active_player: activePlayer,
        board_state: tps,
        ptn,
        board_size: boardSize,
        ranked,
        room_id: roomId,
      },
    }).spread((game, created) => {
      if (!created) {
        game.update({
          board_state: tps,
          ptn,
          active_player: activePlayer,
        });
      }
    });
  });
};

const endCorrespondence = roomId => new Promise((res, rej) => {
  AsyncGame.destroy({
    where: {
      room_id: roomId,
    },
  })
    .then(result => res(result));
});

const updateUserName = (userID, currentUsername, newUsername) => new Promise((res, rej) => {
  User.findById(userID)
    .then((person) => {
      if (person.dataValues.username === currentUsername) {
        person.update({
          username: newUsername,
        });
        res(person);
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = {
  findUserLocal,
  findUserById,
  createUser,
  logGame,
  getLeaderboard,
  getUserData,
  getUserGames,
  findOrCreateUserByOauth,

  getCurrentUserGames,
  storeAsyncGame,
  endCorrespondence,
  updateUserName,
};
