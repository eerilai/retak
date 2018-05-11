import types, { LOGGEDIN, TOGGLE_LOGIN_LOGOUT, SET_LOGGEDIN_PLAYERS } from './types';

export const login = (usernameOrEmail) => (
  {
    type: LOGGEDIN,
    payload: usernameOrEmail
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