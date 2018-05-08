import { combineReducers } from 'redux';
import initialState from '../initialState';

const rootReducer = combineReducers({
  state: (state = {}) => state
});

export default rootReducer;