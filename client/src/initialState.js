import socketIOClient from 'socket.io-client';

const initialState = {
  users:{},
  currentUser: 'Guest-' + Math.random().toString(36).slice(2,9),
  isLoggedIn: false,
  socket: socketIOClient()
};

export default initialState;