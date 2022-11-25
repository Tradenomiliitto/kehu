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

const middlewares = [thunk];

// Enable redux-logger in development unless set differently by env variable
if (
  process.env.REDUX_LOGGER === "true" ||
  (process.env.REDUX_LOGGER !== "false" &&
    process.env.NODE_ENV === "development")
) {
  middlewares.push(logger);
}

export default createStore(rootReducer, applyMiddleware(...middlewares));
