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

app.get("/bundle.js", (req, res) => {
  console.log("getting bundle");
  res.sendFile(path.join(__dirname, "../client/dist/bundle.js"));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Socket Setup
const io = socket(server);
io.on("connection", function(socket) {
  socket.leave(socket.id);

  socket.on('createGame', async() => {
    // Only creates new game if not already in one
    if (!Object.keys(socket.rooms).length) {
      await socket.join('testRoom'); // TODO: randomize room name
      ('socket.rooms', socket.rooms);
    }
    const pendingGames = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (currentRoom.length === 1) {
        pendingGames.push({ ...currentRoom, name: room});
      }
    }
    socket.broadcast.emit('updateLobby', pendingGames);
  });

  socket.on('broadcastGameUpdate', (data) => {
    console.log('broadcastGameUpdate triggered', data);
    socket.to('testRoom').emit('updateGame', data); // TODO: randomize room name
  });

  socket.on('fetchLobby', () => {
    const games = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (currentRoom.length === 1) {
        games.push({ ...currentRoom, name: room});
      }
    }
    socket.emit('updateLobby', games);
  });

  socket.on('joinGame', (name) => {
    socket.join(name);
    console.log(`someone has joined ${name}`);
    console.log(`${name}: ${JSON.stringify(io.sockets.adapter.rooms[name])}`);
  });
});
