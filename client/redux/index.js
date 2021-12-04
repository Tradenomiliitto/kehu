import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import kehu from "./kehu";
import group from "./group";
import portal from "./portal";
import profile from "./profile";
import report from "./report";

const rootReducer = combineReducers({
  kehu,
  group,
  portal,
  profile,
  report,
});

export default createStore(rootReducer, applyMiddleware(thunk, logger));
