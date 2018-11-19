import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import kehu from "./kehu";
import portal from "./portal";
import profile from "./profile";

const rootReducer = combineReducers({
  kehu,
  portal,
  profile
});

export default createStore(rootReducer, applyMiddleware(logger, thunk));
