const router = require('express').Router();
const passport = require('passport');
const { createUser, updateUserName, getUserData } = require('../../database/queries');

require('../passportConfig');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

router.get('/facebook/redirect', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}));

router.post('/login', passport.authenticate('local'), (req, res) => {
  let currentUsername = req.user.dataValues;
  let currentUserInfo = {
    userID: currentUsername.id,
    currentUsername: currentUsername.username,
    userEmail: currentUsername.email,
    rankedGames: currentUsername.ranked_games,
    rankedWins: currentUsername.ranked_wins,
    rankedLosses: currentUsername.ranked_losses,
    totalGames: currentUsername.total_games
  }
  res.send(currentUserInfo);
});

router.post('/signup', (req, res) => {
  // Add a check to see form filds are correct
  createUser(req.body)
    .then((user) => {
      req.login(user, (err) => {
        if (err) {
          res.status(500)
          res.send('Server Error');
        }
        let currentUsername = user.dataValues;
        let currentUserInfo = {
          userID: currentUsername.id,
          currentUsername: currentUsername.username,
          userEmail: currentUsername.email,
          rankedGames: currentUsername.ranked_games,
          rankedWins: currentUsername.ranked_wins,
          rankedLosses: currentUsername.ranked_losses,
          totalGames: currentUsername.total_games
        }
        res.send(currentUserInfo);
      });
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.end();
  });
});

router.post('/changeUsername', (req, res) => {
  const { userID, currentUsername, newUsername } = req.body;
  updateUserName(userID, currentUsername, newUsername)
  .then((user) => {
    let username = user.dataValues.username
    res.send(username);
  });
});

const authCheck = ((req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});

router.get('/check', authCheck, (req, res) => {
  let currentUsername = req.user.dataValues;
  let currentUserInfo = {
    userID: currentUsername.id,
    currentUsername: currentUsername.username,
    userEmail: currentUsername.email,
    rankedGames: currentUsername.ranked_games,
    rankedWins: currentUsername.ranked_wins,
    rankedLosses: currentUsername.ranked_losses,
    totalGames: currentUsername.total_games
  }
  // console.log('/check', currentUsername)
  res.send(currentUserInfo);
});

router.get('/test', authCheck, (req, res) => {
  res.send(JSON.stringify(req.user));
});

module.exports = router;
