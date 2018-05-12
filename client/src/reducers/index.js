import { combineReducers } from 'redux';
import initialState from '../initialState';
import action from '../actions/actions';
import { LOGGEDIN, TOGGLE_LOGIN_LOGOUT } from '../actions/types';

const rootReducer = (state = initialState, action) => {
   switch (action.type) {
    case LOGGEDIN:
      let usernameOrEmail = action.payload;
      return {
        ...state, 
        currentUser: usernameOrEmail
      };
    case TOGGLE_LOGIN_LOGOUT:
      return { 
        ...state, 
        isLoggedIn: action.payload
      };
    default:
      return state;
   }
};

export default rootReducer;