import types, { SET_ANON_USERNAME, LOGGEDIN, LOGGEDOUT, TOGGLE_LOGIN_LOGOUT, SET_UPDATED_USERNAME, UPDATE_USER_PROFILE, SET_CORR_GAMES } from './types';

export const setAnonUsername = username => (
  {
    type: SET_ANON_USERNAME,
    payload: username,
  }
);

export const login = currentUserInfo => (
  {
    type: LOGGEDIN,
    payload: currentUserInfo,
  }
);

export const logout = resetUserInfo => (
  {
    type: LOGGEDOUT,
    payload: resetUserInfo,
  }
);

export const toggleLoginLogout = status => (
  {
    type: TOGGLE_LOGIN_LOGOUT,
    payload: status,
  }
);

export const changeCurrentUsername = updatedUsername => (
  {
    type: SET_UPDATED_USERNAME,
    payload: updatedUsername,
  }
);

export const updateUserProfile = updateCurrentUserInfo => (
  {
    type: UPDATE_USER_PROFILE,
    payload: updateCurrentUserInfo,
  }
);

export const setCorrGames = games => (
  {
    type: SET_CORR_GAMES,
    payload: games,
  }
);
