import { createStore, applyMiddleware, compose, Store, Action, Unsubscribe } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import initialState, { ReduxState } from "./initialState";

const ext: Function = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export const store: Store<ReduxState, Action<any>> = createStore<ReduxState, Action<any>, {}, {}>(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        ext ? ext() : undefined
    )
);

export const unsubscribe: Unsubscribe = store.subscribe(() => {
    console.log("store changed", store.getState());
});

export default store;
