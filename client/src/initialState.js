import socketIOClient from 'socket.io-client';
import generateCharacterName from './components/characterName';

const initialState = {
  isLoggedIn: false,
  userID: null,
  // currentUser: 'Guest-' + Math.random().toString(36).slice(2,6),
  currentUser: generateCharacterName(),
  userEmail: null,
  rankedGames: null,
  rankedWins: null,
  rankedLosses: null,
  totalGames: null,
  avatar: null,
  socket: socketIOClient(undefined, {forceNew: true})
};

export default initialState;