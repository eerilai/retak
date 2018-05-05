const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

require('dotenv').config();

const db = require('../database');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());

app.use(session());

app.use('/auth', authRoutes);

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.listen(3000, () => { console.log('Listening on port 3000'); });
