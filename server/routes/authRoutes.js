const router = require('express').Router();
const passport = require('passport');
require('../passportConfig');

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('success?');
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;