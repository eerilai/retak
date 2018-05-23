const express = require('express');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const sharedSession = require('express-socket.io-session');



var fs = require('fs')
var https = require('https')





require('dotenv').config();

const GAME_NOT_STARTED = 0
const GAME_STARTED = 1
const GAME_FINISHED = 2

const db = require('../database');
const { logGame, getLeaderboard, getUserGames,
  getUserData, storeAsyncGame, getCurrentUserGames,
  endCorrespondence } = require('../database/queries');
const authRoutes = require('./routes/authRoutes');
const filterLobbyList = require('./lobbyHelper');

const app = express();

app.use(bodyParser());

const session = require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
});

app.use(session);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// Implement authorization check for relevant requests, ie profile, logout, etc
const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
};

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.post('/record', (req, res) => {
  logGame(req.body);
});

app.get('/leaderboard', async (req, res) => {
  const board = await getLeaderboard();
  res.json(board);
});

app.get('/users/:username/data', async (req, res) => {
  const data = await getUserData(req.params.username);
  res.json(data);
});


app.get('/users/:username/games', async (req, res) => {
  const games = await getUserGames(req.params.username);
  console.log(games[0].dataValues);
  res.json(games);
});

app.get('/users/:userID/games/current', async (req, res) => {
  const games = await getCurrentUserGames(req.params.userID);
  res.json(games);
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/bundle.js'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



//Socket Setup
let rooms = 0;
const io = socket(server);

io.use(sharedSession(session, {
  autoSave: true
}))

io.on('connection', (socket) => {
  socket.leave(socket.id);

  // Update username on socket session on login
  socket.on('login', (username) => {
    console.log('login!!!!!!!', username)
    const { session } = socket.handshake;
    console.log('session!!!!!!', session)
    session.username = username;
    console.log('session.username!!!!!!', session.username)
    session.save();
  });

  // Maintain session for anon users on App initialize if not logged in
  socket.on('AnonUserSession', (username) => {
    const { session } = socket.handshake;
    if (!session.username) {
      session.username = username;
      session.save();
      socket.emit('setAnonUsername', username);
    } else {
      socket.emit('setAnonUsername', session.username);
    }
  });

  // Create a new game and save game state to room
  socket.on('createGame', async ({ boardSize, timeControl, timeIncrement, isFriendGame, isPrivate, isLive, roomId }) => {

    if (!isLive) roomId += '_c';
    await socket.join(roomId);
    const room = io.sockets.adapter.rooms[roomId];
    console.log('socket handshake session username', socket.handshake.session);
    room.player1 = socket.handshake.session.username;
    room.activePlayer = socket.handshake.session.username;
    room.boardSize = boardSize
    //setting the time of the room
    room.timeControl = timeControl;
    room.player1Time = timeControl
    room.player2Time = timeControl
    room.timeIncrement = timeIncrement
    //setting the status of the room: not started yet
    room.status = GAME_NOT_STARTED;
    //uninitialized the interival ID
    room.intervalID = null
    room.isFriendGame = isFriendGame;
    room.isPrivate = isPrivate || isFriendGame;
    room.isLive = isLive;
    room.spectators = {};


    socket.emit('gameInitiated', {

      roomId
    });
  });

  // Serve game state on LiveGame component initialize
  socket.on('fetchGame', async (roomId, loadGame) => {
    if (!io.sockets.adapter.rooms[roomId]) {
      socket.join(roomId);
    }
    if (!io.sockets.adapter.rooms[roomId].sockets[socket.id]) {
      socket.join(roomId);
    }
    const { username } = socket.handshake.session;
    const room = io.sockets.adapter.rooms[roomId];

    //sanity check
    if (!room)
      return

    let { gameState, activePlayer, boardSize, timeControl, player1Time, player2Time, isPrivate, spectators } = room;
    if (loadGame !== null) {
      const {
        player1, player2, active_player,
        board_state, ptn, board_size,
        ranked, isPrivate, spectators,
      } = loadGame;
      room.player1 = player1;
      room.player2 = player2;
      room.gameState = {
        tps: board_state,
        ptn,
      };
      room.activePlayer = active_player;
      room.boardSize = board_size;
      room.isLive = false;
    }

    const { player1, player2 } = room;
    let status = room.status;//when the player2 joined, game status will change
    if (username === player1) {
      if (!player2) {
        socket.emit('pendingGame', { boardSize, timeControl, roomId });
      } else {//player1 reconnect, sync game

        io.in(roomId).emit('syncGame', { boardSize, player1Time, player2Time, status, gameState, roomId, player1, player2, activePlayer });
      }
    } else if (!player2) {//player2 joined, game starts, timer starts, setinterval here
      room.player2 = username;

      room.status = GAME_STARTED;
      status = room.status
      room.intervalID = setInterval(UpdateTime, 1000, roomId)


      io.to(roomId).emit('syncGame', {
        boardSize, gameState: 'new', roomId, player1, player2: room.player2, activePlayer, player1Time, player2Time, status
      });
    } else if (username !== player2 && isPrivate) {
      socket.leave(roomId);
      socket.emit('gameAccessDenied');
    } else {
      if (username !== player2) { //specatator
        room.spectators[username] = username;
        socket.emit('syncGame', {
          boardSize, gameState, roomId, player1, player2, activePlayer, player1Time, player2Time, status,
        });
      } else { //player2 reconnect 
        socket.emit('syncGame', {
          boardSize, gameState, roomId, player1, player2, activePlayer, player1Time, player2Time, status
        });
      }
    }

    // Update lobby
    const lobbyList = filterLobbyList(io.sockets.adapter.rooms);
    socket.broadcast.emit('updateLobby', lobbyList);
  });

  // Update game for each piece move
  socket.on('updateGame', ({ gameState, activePlayer, roomId }) => {
    const room = io.sockets.adapter.rooms[roomId];

    //sanity check
    if (!room)
      return
    room.gameState = gameState;
    room.activePlayer = activePlayer;
    let { boardSize, timeControl, player1, player2, player1Time, player2Time, status, timeIncrement } = room;

    if (room.status === GAME_STARTED && timeControl !== undefined) {
      if (player1 !== activePlayer) {
        player1Time += timeIncrement
        if (player1Time > timeControl) {
          player1Time = timeControl
        }
        room.player1Time = player1Time
      } else {
        player2Time += timeIncrement
        if (player2Time > timeControl) {
          player2Time = timeControl
        }
        room.player2Time = player2Time
      }
    }

    if (room.isLive === false) storeAsyncGame(gameState, room, roomId);


    socket.to(roomId).emit('syncGame', {
      boardSize, gameState, player1Time, player2Time, status, player1, player2, activePlayer, roomId,
    });
  });

  // Add 'isClosed' property to finished game and update lobby
  socket.on('closeGame', (roomId, game) => {
    logGame(game);
    let room = io.sockets.adapter.rooms[roomId]
    room.status = GAME_FINISHED
    clearInterval(room.intervalID)



    endCorrespondence(roomId);
    io.sockets.adapter.rooms[roomId].isClosed = true;
    const lobbyList = filterLobbyList(io.sockets.adapter.rooms);
    socket.broadcast.emit('updateLobby', lobbyList);
  });

  // Serve lobby on Lobby component initialize
  socket.on('fetchLobby', () => {
    const lobbyList = filterLobbyList(io.sockets.adapter.rooms);
    socket.emit('updateLobby', lobbyList);
  });

  // Chat/Typing
  socket.on('chat', function (data) {
    io.to(data.room).emit('chat', data);
  });
  socket.on('typing', function (data) {
    socket.to(data.room).emit('typing', data);
  });
});

function UpdateTime(roomId) {

  let room = io.sockets.adapter.rooms[roomId];


  //sanity check
  if (!room || room.status !== GAME_STARTED)
    return


  let { player1, player2, player1Time, player2Time, activePlayer, status, intervalID } = room;

  if (player1Time === 0 || player2Time === 0) {

    clearInterval(intervalID)
    //tell both players time out happened, emit timeout person
    room.status = GAME_FINISHED
    status = room.status
    // sending to all clients in the room, including sender
    io.to(roomId).emit('timeOut', { activePlayer, roomId });
    return
  }

  if (player1 === activePlayer) {
    player1Time -= 1
  } else {
    player2Time -= 1
  }
  room.player1Time = player1Time
  room.player2Time = player2Time

  io.to(roomId).emit('updateTime', { roomId, player1Time, player2Time });
}

