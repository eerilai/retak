const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();

const db = require("../database");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

// Implement authorization check for relevant requests, ie profile, logout, etc
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
};
//app.use("/", express.static(path.join(__dirname, "../client/dist/")));

app.get("/bundle.js", (req, res) => {
  console.log("getting bundle");
  res.sendFile(path.join(__dirname, "../client/dist/bundle.js"));
});
app.get("/*", (req, res) => {
  console.log("Wildcard route, sending back index.html :)");
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
