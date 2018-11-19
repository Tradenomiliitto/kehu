import { get, del, post } from "../util/ApiUtil";
import { TOGGLE_ADD_KEHU_MODAL } from "./portal";

export const ADD_KEHU = "kehu/ADD_KEHU";
export const ADD_KEHU_SUCCESS = "kehu/ADD_KEHU_SUCCESS";
export const ADD_KEHU_ERROR = "kehu/ADD_KEHU_ERROR";
export const ADD_KEHU_RESET = "kehu/ADD_KEHU_RESET";

export const UPDATE_KEHU = "kehu/UPDATE_KEHU";
export const UPDATE_KEHU_SUCCESS = "kehu/UPDATE_KEHU_SUCCESS";
export const UPDATE_KEHU_ERROR = "kehu/UPDATE_KEHU_ERROR";
export const UPDATE_KEHU_RESET = "kehu/UPDATE_KEHU_RESET";

export const REMOVE_KEHU = "kehu/REMOVE_KEHU";
export const REMOVE_KEHU_SUCCESS = "kehu/REMOVE_KEHU_SUCCESS";
export const REMOVE_KEHU_ERROR = "kehu/REMOVE_KEHU_ERROR";

export const GET_KEHUS = "kehu/GET_KEHUS";
export const GET_KEHUS_SUCCESS = "kehu/GET_KEHUS_SUCCESS";
export const GET_KEHUS_ERROR = "kehu/GET_KEHUS_ERROR";

export const initialState = {
  savedKehu: null,
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

export function removeKehu(id) {
  return async dispatch => {
    try {
      dispatch({ type: REMOVE_KEHU });
      await del(`/kehut/${id}`);
      dispatch({ type: REMOVE_KEHU_SUCCESS, payload: id });
    } catch (e) {
      dispatch({ type: REMOVE_KEHU_ERROR, payload: e });
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
  return dispatch => {
    dispatch({ type: ADD_KEHU_RESET });
    dispatch({ type: TOGGLE_ADD_KEHU_MODAL });
  };
}

function addKehuToState(kehus, kehu) {
  return [...kehus, kehu];
}

function updateKehuInState(kehus, kehu) {
  return kehus.map(k => (k.id === kehu.id ? kehu : k));
}

function removeKehuFromState(kehus, removedId) {
  return kehus.filter(k => k.id !== removedId);
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_KEHU:
    case GET_KEHUS:
    case REMOVE_KEHU:
    case UPDATE_KEHU:
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
        savedKehu: action.payload.kehu,
        kehus: addKehuToState(state.kehus, action.payload.kehu)
      };
    case UPDATE_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        savedKehu: action.payload.kehu,
        kehus: updateKehuInState(state.kehus, action.payload.kehu)
      };

    case UPDATE_KEHU_ERROR:
    case ADD_KEHU_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case ADD_KEHU_RESET:
    case UPDATE_KEHU_RESET:
      return {
        ...state,
        loading: false,
        error: null,
        savedKehu: null
      };

    case REMOVE_KEHU_SUCCESS:
      return {
        ...state,
        kehus: removeKehuFromState(state.kehus, action.payload),
        loading: false,
        error: null
      };
    case REMOVE_KEHU_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
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
