import { createStore, applyMiddleware, compose, Store, Action } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import initialState, { ReduxState } from "./initialState";

const middleware = [thunk];

const ext: Function = (window as any).__REDUX_DEVTOOLS_EXTENSION__;


const store = createStore<ReduxState, Action<any>, {}, {}>(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        ext ? ext() : undefined
    )
);

store.subscribe(() => console.log("store changed", store.getState()));

export default store;