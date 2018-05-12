const initialState = {
  users:{},
  currentUser: 'Tak-guest-' + Math.random().toString(36).slice(2,9),
  isLoggedIn: false
};

export default initialState;