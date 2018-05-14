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
  console.log("getting bundle");
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
const io = socket(server);
io.on("connection", function(socket) {
  socket.leave(socket.id);

  socket.on("syncGame", async username => {
    // Only creates new game if not already in one
    if (!Object.keys(socket.rooms).length) {
      await socket.join(username);
      io.sockets.adapter.rooms[username].player1 = username;
    } else {
      Object.keys(socket.rooms).forEach(room => {
        gameRoom = io.sockets.adapter.rooms[room];
        io.in(room).emit("playerJoin", gameRoom.player1, username);
      });
    }

    // Find rooms with only one socket attached (i.e. pending games)
    const pendingGames = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (currentRoom.length === 1) {
        pendingGames.push({ ...currentRoom, name: room });
      }
    }
    socket.broadcast.emit("updateLobby", pendingGames);
  });

  // Update game for each piece move
  socket.on("broadcastGameUpdate", data => {
    socket.to(data.game).emit("updateGame", data);
  });

  // Serve pending game list to lobby on lobby initialize
  socket.on("fetchLobby", () => {
    const games = [];
    const { rooms } = io.sockets.adapter;
    for (let room in rooms) {
      const currentRoom = rooms[room];
      if (currentRoom.length === 1) {
        games.push({ ...currentRoom, name: room });
      }
    }
    socket.emit("updateLobby", games);
  });

  // Join user to pending game
  socket.on("joinGame", (roomName, username) => {
    socket.join(roomName);
    io.sockets.adapter.rooms[roomName].player2 = username;
  });

  //Chat/Typing
  socket.on("chat", function(data) {
    console.log("data,", data);
    io.sockets.emit("chat", data);
  });
  socket.on("typing", function(data) {
    console.log("typingdata", data);
    socket.broadcast.emit("typing", data);
  });
});
