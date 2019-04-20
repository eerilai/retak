const Sequelize = require('sequelize');

// options for local database
const options = {
  dialect: 'postgres',
  dialectOptions: {
    dialectModulePath: 'pg',
    trustedConnection: true,
  },
  hostname: process.env.PG_HOSTNAME || 'localhost',
  database: process.env.PG_DATABASE || 'test',
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD
};

const dbPath = process.env.DATABASEURL || options;
const sequelize = new Sequelize(dbPath);

sequelize.authenticate()
  .then(() => {
    console.log('successfully connected to db');
  })
  .catch((err) => {
    console.error(err);
  });

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  googleID: {
    type: Sequelize.STRING,
    unique: true,
  },
  facebookID: {
    type: Sequelize.STRING,
    unique: true,
  },
  total_games: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  ranked_games: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  ranked_wins: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  ranked_losses: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

const Game = sequelize.define('game', {
  player1: {
    type: Sequelize.STRING,
  },
  player2: {
    type: Sequelize.STRING,
  },
  board_state: {
    type: Sequelize.STRING,
  },
  ptn: {
    type: Sequelize.STRING,
  },
  victor: {
    type: Sequelize.STRING,
  },
  win_type: {
    type: Sequelize.STRING,
  },
  board_size: {
    type: Sequelize.INTEGER,
  },
  ranked: {
    type: Sequelize.BOOLEAN,
  },
});

User.hasMany(Game, { foreignKey: 'player1_id' });
User.hasMany(Game, { foreignKey: 'player2_id' });

const AsyncGame = sequelize.define('async_game', {
  player1: {
    type: Sequelize.STRING,
  },
  player2: {
    type: Sequelize.STRING,
  },
  active_player: {
    type: Sequelize.STRING,
  },
  board_state: {
    type: Sequelize.STRING,
  },
  ptn: {
    type: Sequelize.JSON,
  },
  board_size: {
    type: Sequelize.INTEGER,
  },
  ranked: {
    type: Sequelize.BOOLEAN,
  },
  room_id: {
    type: Sequelize.STRING,
  },
});

User.hasMany(AsyncGame, { foreignKey: 'player1_id' });
User.hasMany(AsyncGame, { foreignKey: 'player2_id' });

// pass { force: true} into these if you'd like to only reset one table
// User.sync({ force: true })
//   .then(() => {
//     console.log('user table created');
//   });

// Game.sync({ force: true })
//   .then(() => {
//     console.log('game table created');
//   });

// AsyncGame.sync({ force: true })
//   .then(() => {
//     console.log('async game table created');
//   });

// syncs all tables, drop and rebuild all tables with { force: true }
sequelize.sync()
  .then(() => {
    console.log('tables synced');
  });

module.exports = {
  Sequelize,
  sequelize,
  User,
  Game,
  AsyncGame
};
