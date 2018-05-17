const Sequelize = require('sequelize');

// options for local database
const options = {
  dialect: 'postgres',
  dialectOptions: {
    dialectModulePath: 'pg',
    trustedConnection: true,
  },
  host: 'localhost',
  database: 'test',
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

// pass { force: true} into these if you'd like to only reset one table
// User.sync()
//   .then(() => {
//     console.log('user table created');
//   });

// Game.sync()
//   .then(() => {
//     console.log('game table created');
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
};
