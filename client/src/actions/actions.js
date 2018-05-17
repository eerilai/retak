import types, { SET_ANON_USERNAME, LOGGEDIN, TOGGLE_LOGIN_LOGOUT, SET_LOGGEDIN_PLAYERS } from './types';

export const setAnonUsername = (username) => (
  {
    type: SET_ANON_USERNAME,
    payload: username
  }
);

export const login = (currentUserInfo) => (
  {
    type: LOGGEDIN,
    payload: currentUserInfo
  }
);

export const toggleLoginLogout = (status) => (
  {
    type: TOGGLE_LOGIN_LOGOUT,
    payload: status
  }
);

export const setLoggedInPlayers = (player1, player2) => (
  {
    type: SET_LOGGEDIN_PLAYERS,
    payload:{
      player1,
      player2
    }
  }
)