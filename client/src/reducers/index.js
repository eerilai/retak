import { combineReducers } from 'redux';
import initialState from '../initialState';
import action from '../actions/actions';
import { LOGGEDIN, TOGGLE_LOGIN_LOGOUT, SET_ANON_USERNAME } from '../actions/types';

const rootReducer = (state = initialState, action) => {
   switch (action.type) {
    case LOGGEDIN:
      let currentUserInfo = action.payload;
      return {
        ...state, 
        currentUser: currentUserInfo.currentUser,
        userEmail: currentUserInfo.userEmail,
        rankedGames: currentUserInfo.rankedGames,
        rankedWins: currentUserInfo.rankedWins,
        totalGames: currentUserInfo.totalGames
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
        currentUser: username
      };
    default:
      return state;
   }
};

export default rootReducer;