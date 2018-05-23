const router = require('express').Router();
const passport = require('passport');
const { createUser } = require('../../database/queries');

require('../passportConfig');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});


router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/redirect', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/'
}))


router.post('/login', passport.authenticate('local'), (req, res) => {
  let currentUser = req.user.dataValues;
  let currentUserInfo = Object.assign({},
    {
      userID: currentUser.id,
      currentUser: currentUser.username,
      userEmail: currentUser.email,
      rankedGames: currentUser.ranked_games,
      rankedWins: currentUser.ranked_wins,
      rankedLosses: currentUser.ranked_losses,
      totalGames: currentUser.total_games
    }
  )
  console.log('/login', currentUserInfo)
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
        let currentUser = user.dataValues;
        let currentUserInfo = Object.assign({},
          {
            userID: currentUser.id,
            currentUser: currentUser.username,
            userEmail: currentUser.email,
            rankedGames: currentUser.ranked_games,
            rankedWins: currentUser.ranked_wins,
            rankedLosses: currentUser.ranked_losses,
            totalGames: currentUser.total_games
          }
        )
        console.log('/signup', currentUser)
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

const authCheck = ((req, res, next) => {
  console.log(req.user, 'authCheck in authRoutes.js')
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});

router.get('/check', authCheck, (req, res) => {
  let currentUser = req.user.dataValues;
  let currentUserInfo = Object.assign({},
    {
      userID: currentUser.id,
      currentUser: currentUser.username,
      userEmail: currentUser.email,
      rankedGames: currentUser.ranked_games,
      rankedWins: currentUser.ranked_wins,
      rankedLosses: currentUser.ranked_losses,
      totalGames: currentUser.total_games
    }
  )
  console.log('/check', currentUser)
  res.send(currentUserInfo);
});

router.get('/test', authCheck, (req, res) => {
  res.send(JSON.stringify(req.user));
});

module.exports = router;
