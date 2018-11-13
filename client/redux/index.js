import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import portal from "./portal";

const rootReducer = combineReducers({
  portal
});

export default createStore(rootReducer, applyMiddleware(logger));
