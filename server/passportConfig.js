const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { User, Sequelize } = require('../database');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
   .then((user) => {
     done(null, user);
   });
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: '/auth/google/redirect'
  }, (accesToken, refreshToken, profile, done) => {
    User.findOrCreate({
      where: {
        googleID: profile.id
      },
      defaults: {
        username: 'Tak-user-' + Math.random().toString(36).slice(2,9)
      }
    })
      .then(([user, created]) => {
        done(null, user);
      });
  })
);

passport.use(new LocalStrategy(
  (emailOrUsername, password, done) => {
    const Op = Sequelize.Op;
    User.findOne({
      where: {
        [Op.or]: [
          { username: emailOrUsername },
          { email: emailOrUsername }
        ]
      }
    })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      })
}));