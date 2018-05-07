import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
// import {  } from './actions'

const initialState = {};

const middleware = [thunk];

const store = createStore(
	rootReducer, 
	initialState, 
	compose(
		applyMiddleware(...middleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

// Dispatch actions
// store.dispatch(action);

store.subscribe(() => {
	console.log('store changed', store.getState())
});

// store.unsubscribe();

export default store;