import { combineReducers } from 'redux';
import initialState from '../initialState';
import action from '../actions/actions';
import { LOGGEDIN, LOGGEDOUT, TOGGLE_LOGIN_LOGOUT, SET_ANON_USERNAME, UPDATE_USER_PROFILE, SET_UPDATED_USERNAME } from '../actions/types';

const rootReducer = (state = initialState, action) => {
   switch (action.type) {
    case LOGGEDIN:
      let currentUserInfo = action.payload;
      return {
        ...state, 
        userID: currentUserInfo.userID,
        currentUsername: currentUserInfo.currentUsername,
        userEmail: currentUserInfo.userEmail,
        rankedGames: currentUserInfo.rankedGames,
        rankedWins: currentUserInfo.rankedWins,
        rankedLosses: currentUserInfo.rankedLosses,
        totalGames: currentUserInfo.totalGames
      };
    case LOGGEDOUT:
      let resetUserInfo = action.payload;
      return {
        ...state,
        userID: resetUserInfo.userID,
        currentUsername: resetUserInfo.currentUsername,
        userEmail: resetUserInfo.userEmail,
        rankedGames: resetUserInfo.rankedGames,
        rankedWins: resetUserInfo.rankedWins,
        rankedLosses: resetUserInfo.rankedLosses,
        totalGames: resetUserInfo.totalGames
      };
    case TOGGLE_LOGIN_LOGOUT:
      return { 
        ...state, 
        isLoggedIn: action.payload
      };
    case SET_ANON_USERNAME:
      let username = action.payload;
      return {
        ...state,
        currentUsername: username
      };
    case UPDATE_USER_PROFILE:
      let newUserInfo = action.payload;
      return {
        ...state,
        currentUsername: newUserInfo
      };
    case SET_UPDATED_USERNAME:
      let updatedUsername = action.payload;
      return {
        ...state,
        currentUsername: updatedUsername
      };
    default:
      return state;
   }
};

export default rootReducer;