import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import kehu from "./kehu";
import portal from "./portal";
import user from "./user";

const rootReducer = combineReducers({
  kehu,
  portal,
  user
});

export default createStore(rootReducer, applyMiddleware(logger, thunk));
