const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

require('dotenv').config();
// Feel free to move or copy/paste the line below 
// where db queries are required
const db = require('../database');

const app = express();

console.log('session secret: ' + process.env.SESSION_SECRET);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 10 * 1000
  }
}));

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.listen(3000, () => { console.log('Listening on port 3000'); });
