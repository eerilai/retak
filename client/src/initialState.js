import socketIOClient from 'socket.io-client';

const initialState = {
  isLoggedIn: false,
  userID: null,
  currentUser: 'Guest-' + Math.random().toString(36).slice(2,6),
  userEmail: null,
  rankedGames: null,
  rankedWins: null,
  totalGames: null,
  avatar: null,
  socket: socketIOClient( undefined, {forceNew: true})  
};

export default initialState;