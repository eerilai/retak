import passport from "passport";
import { getCustomRepo, User } from "../database";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const LocalStrategy = require('passport-local').Strategy;
const {
    findOrCreateUserByOauth
} = require('../database/queries');

passport.serializeUser((user: User, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const repo = await getCustomRepo("UserRepository");
        const user = await repo.findOne({ id });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_OAUTH_ID,
        clientSecret: process.env.GOOGLE_OAUTH_SECRET,
        callbackURL: '/auth/google/redirect'
    }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
        try {
            const userRepo = await getCustomRepo("UserRepository");
            const user = await userRepo.findOrCreate({
                googleId: profile.id,
                email: profile.emails[0].value
            });
            done(null, user);
        } catch (err) {
            done(err);
        }
    })
);

passport.use(new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_OAUTH_ID,
        clientSecret: process.env.FACEBOOK_OAUTH_SECRET,
        callbackURL: '/auth/facebook/redirect',
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
        try {
            const userRepo = await getCustomRepo("UserRepository");
            const user = await userRepo.findOrCreate({
                facebookId: profile.id,
                email: profile.emails[0].value
            });
            done(null, user);
        } catch (err) {
            done(err);
        }
    })
);



passport.use(new LocalStrategy(async (usernameOrEmail: string, password: string, done: Function) => {
    try {
        const repo = await getCustomRepo("UserRepository");
        done(null, await repo.authenticateUser(usernameOrEmail, password));
    } catch (err) {
        done(new Error(`Unable to find user: ${err.message}`));
    }
}));