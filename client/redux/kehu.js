import { get, post } from "../util/ApiUtil";

export const ADD_KEHU = "kehu/ADD_KEHU";
export const ADD_KEHU_SUCCESS = "kehu/ADD_KEHU_SUCCESS";
export const ADD_KEHU_ERROR = "kehu/ADD_KEHU_ERROR";
export const ADD_KEHU_RESET = "kehu/ADD_KEHU_RESET";

export const GET_KEHUS = "kehu/GET_KEHUS";
export const GET_KEHUS_SUCCESS = "kehu/GET_KEHUS_SUCCESS";
export const GET_KEHUS_ERROR = "kehu/GET_KEHUS_ERROR";

export const initialState = {
  addedKehu: null,
  error: null,
  loading: false,
  kehus: [],
  kehusLoaded: false
};

export function addKehu(data) {
  return async dispatch => {
    try {
      dispatch({ type: ADD_KEHU });
      const kehu = await post("/kehut", data);
      dispatch({ type: ADD_KEHU_SUCCESS, payload: kehu });
    } catch (e) {
      dispatch({ type: ADD_KEHU_ERROR, payload: e });
    }
  };
}

export function getKehus() {
  return async dispatch => {
    try {
      dispatch({ type: GET_KEHUS });
      const kehus = await get("/kehut");
      dispatch({ type: GET_KEHUS_SUCCESS, payload: kehus });
    } catch (e) {
      dispatch({ type: GET_KEHUS_ERROR, payload: e });
    }
  };
}

export function resetAddKehuState() {
  return { type: ADD_KEHU_RESET };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_KEHU:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        addedKehu: action.payload.kehu
      };
    case ADD_KEHU_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case ADD_KEHU_RESET:
      return {
        ...state,
        loading: false,
        error: null,
        addedKehu: null
      };

    case GET_KEHUS:
      return {
        ...state,
        loading: true
      };
    case GET_KEHUS_SUCCESS:
      return {
        ...state,
        loading: false,
        kehus: action.payload,
        kehusLoaded: true
      };
    case GET_KEHUS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        kehusLoaded: true
      };

    default:
      return state;
  }
}
