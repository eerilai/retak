const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
const socket = require("socket.io");

require("dotenv").config();

const db = require("../database");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

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
app.use("/game", gameRoutes);

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

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Socket Setup
const io = socket(server);
io.on("connection", function(socket) {
  console.log("made socket connection", socket.id);
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
  socket.on("typing", function(data) {
    console.log("data", data);
    socket.broadcast.emit("typing", data);
  });
});
