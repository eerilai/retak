import socketIOClient from 'socket.io-client';
import generateCharacterName from './components/characterName';

const initialState = {
  isLoggedIn: false,
  userID: null,
  currentUsername: generateCharacterName(),
  userEmail: null,
  rankedGames: null,
  rankedWins: null,
  rankedLosses: null,
  totalGames: null,
  avatar: null,
  socket: socketIOClient(undefined, { forceNew: true }),
  games: [],
};

export default initialState;
