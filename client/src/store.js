import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import initialState from './initialState';


const middleware = [thunk];

const store = createStore(
	rootReducer, 
	initialState, 
	compose(
		applyMiddleware(...middleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

store.subscribe(() => {
	console.log('store changed', store.getState())
});

export default store;