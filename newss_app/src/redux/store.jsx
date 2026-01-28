import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import NewsReducer from "./reducers/NewsReducer";

const rootReducer = combineReducers({
  newsData: NewsReducer});

const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(  rootReducer,  composeEnhancers(applyMiddleware(thunk)));

export default store;
