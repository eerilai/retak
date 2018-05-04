const Sequelize = require('sequelize');

// options for local database
const options = {
  dialect: 'postgres',
  dialectOptions: {
    dialectModulePath: 'pg',
    trustedConnection: true
  },
  host: 'localhost',
  database: 'test'
}

const dbPath = process.env.DATABASEURL || options;
const sequelize = new Sequelize(dbPath);

sequelize.authenticate()
  .then(() => {
    console.log('successfully connected to db');
  })
  .catch((err) => {
    console.error(err);
  })

const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true
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
    unique: true
  },
});

const Game = sequelize.define('game', {
  player1ID: {
    type: Sequelize.STRING,
  },
  player2ID: {
    type: Sequelize.STRING,
  },
  boardState: {
    // TODO: Not 100% sure if boardState will be JSON
    type: Sequelize.JSON,
  },
  PTN: {
    // TODO: Not 100% sure if PTN will be JSON
    type: Sequelize.JSON,
  },
  victor: {
    type: Sequelize.STRING,
  },
})

// to drop table if exists, pass { force: true } as argument in User.sync
User.sync()
  .then(() => {
    console.log('user table created');
  });

module.exports = {
  sequelize,
  User,
  Game
};