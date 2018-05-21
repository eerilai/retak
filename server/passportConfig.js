const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const LocalStrategy = require('passport-local').Strategy;
const {
  findUserById,
  findOrCreateUserByOauth
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
    console.log('google', profile.emails[0].value)

    let options = {
      googleID: profile.id,
      email: profile.emails[0].value
    }
    findOrCreateUserByOauth(options)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err);
      });
  })
);

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_OAUTH_ID,
    clientSecret: process.env.FACEBOOK_OAUTH_SECRET,
    callbackURL: '/auth/facebook/redirect',
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
  }, (accesToken, refreshToken, profile, done) => {
    console.log('facebook', profile.emails[0].value)
    let options = {
      facebookID: profile.id,
      email: profile.emails[0].value
    }
    findOrCreateUserByOauth(options)
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
    User.findOne({
      where: {
        [Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
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