const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const bodyParser = require("body-parser");
const socket = require("socket.io");

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

app.use("/", express.static(path.join(__dirname, "../client/dist")));
app.get("/bundle.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/bundle.js"));
});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//Socket Setup
let rooms = 0;
const io = socket(server);

io.on('connection', (socket) => {
  socket.leave(socket.id);

  socket.on('syncGame', async ({ username, roomId }) => {
    // Only creates new game if not already in one
    const room = io.sockets.adapter.rooms[roomId];
    if (username !== room.player1) {
      if (!room.player2) {
        await socket.join(roomId);
        room.player2 = username;
        io.in(roomId).emit('playerJoin', {
          boardSize: room.boardSize,
          player1: room.player1,
          player2: room.player2
        });
      } else if (room.isPrivate) {
        socket.emit('fullRoom');
      } else {
        socket.join(roomId);
      }
    }

    // Update lobby
    const pendingGames = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (!currentRoom.isPrivate && !currentRoom.player2) {
        pendingGames.push({ ...currentRoom, name: room });
      }
    }
    socket.broadcast.emit('updateLobby', pendingGames);
  });

  // Update game for each piece move
  socket.on('updateGame', ({ col, row, stone, roomId }) => {
    socket.to(roomId).emit('opponentMove', { col, row, stone, roomId });
  });

  // Serve pending game list to lobby on lobby initialize
  socket.on('fetchLobby', () => {
    const games = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (!currentRoom.isPrivate && !currentRoom.player2) {
        games.push({ ...currentRoom, name: room });
      }
    }
    socket.emit('updateLobby', games);
  });

  // Create a new game
  socket.on('createGame', async ({ username, boardSize, isPrivate }) => {
    const roomId = Math.random().toString(36).slice(2, 9);
    await socket.join(roomId);
    const room = io.sockets.adapter.rooms[roomId];
    room.player1 = username;
    room.boardSize = boardSize;
    room.isPrivate = isPrivate;
    socket.emit('gameInitiated', {
      roomId
    });
  });

  //Chat/Typing
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });
});
