const router = require('express').Router();
const passport = require('passport');
const { createUser } = require('../../database/queries');

require('../passportConfig');

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.post('/signup', (req, res) => {
  createUser(req.body)
    .then((user) => {
      req.login(user, (err) => {
        if (err) {
          res.status(500)
          res.redirect('/');
        }
        res.redirect('/');
      });
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

const authCheck = ((req, res, next) => {
  if(!req.user) {
    res.redirect('/');
  } else {
    next();
  }
});

router.get('/test', authCheck, (req, res) => {
  res.send(JSON.stringify(req.user));
});

module.exports = router;
