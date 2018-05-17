const initialState = {
  isLoggedIn: false,
  currentUser: 'Tak-guest-' + Math.random().toString(36).slice(2,9),
  userEmail: null,
  rankedGames: null,
  rankedWins: null,
  totalGames: null,
  avatar: null
};

export default initialState;