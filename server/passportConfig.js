const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const {
  findUserById,
  findOrCreateUserByGoogleId,
  findUserLocal
} = require('../database/queries');
const { User, Sequelize } = require('../database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  findUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: '/auth/google/redirect'
  }, (accesToken, refreshToken, profile, done) => {
    findOrCreateUserByGoogleId(profile.id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  })
);

passport.use(new LocalStrategy(
  (usernameOrEmail, password, done) => {
    const Op = Sequelize.Op;
    findUserLocal(usernameOrEmail, password)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      })
}));