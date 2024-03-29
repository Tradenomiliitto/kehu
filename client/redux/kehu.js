import moment from "moment";
import { get, del, post, put } from "../util/ApiUtil";
import { RESET_REPORTS } from "./report";
import { updateFeed } from "./profile";
import { getGroups } from "./group";

export const ADD_KEHU = "kehu/ADD_KEHU";
export const ADD_KEHU_SUCCESS = "kehu/ADD_KEHU_SUCCESS";
export const ADD_KEHU_ERROR = "kehu/ADD_KEHU_ERROR";

export const UPDATE_KEHU = "kehu/UPDATE_KEHU";
export const UPDATE_KEHU_SUCCESS = "kehu/UPDATE_KEHU_SUCCESS";
export const UPDATE_KEHU_ERROR = "kehu/UPDATE_KEHU_ERROR";

export const RESET_KEHU_FORM = "kehu/RESET_KEHU_FORM";

export const REMOVE_KEHU = "kehu/REMOVE_KEHU";
export const REMOVE_KEHU_SUCCESS = "kehu/REMOVE_KEHU_SUCCESS";
export const REMOVE_KEHU_ERROR = "kehu/REMOVE_KEHU_ERROR";

export const GET_KEHUS = "kehu/GET_KEHUS";
export const GET_KEHUS_SUCCESS = "kehu/GET_KEHUS_SUCCESS";
export const GET_KEHUS_ERROR = "kehu/GET_KEHUS_ERROR";

export const SEND_KEHU = "kehu/SEND_KEHU";
export const SEND_KEHU_SUCCESS = "kehu/SEND_KEHU_SUCCESS";
export const SEND_KEHU_ERROR = "kehu/SEND_KEHU_ERROR";

export const CLAIM_KEHU = "kehu/CLAIM_KEHU";
export const CLAIM_KEHU_SUCCESS = "kehu/CLAIM_KEHU_SUCCESS";
export const CLAIM_KEHU_ERROR = "kehu/CLAIM_KEHU_ERROR";

export const initialState = {
  savedKehu: null,
  error: null,
  removeKehuError: null,
  loading: false,
  kehus: [],
  sentKehus: [],
  kehusLoaded: false,
  sendKehuSuccess: false,
  claimKehuSuccess: false,
};

export function addKehu(data) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: ADD_KEHU });
      const kehu = await post("/kehut", data);
      dispatch({ type: ADD_KEHU_SUCCESS, payload: kehu });
      dispatch({
        type: RESET_REPORTS,
        payload: { kehus: getState().kehu.kehus },
      });
      dispatch(updateFeed());
    } catch (e) {
      dispatch({ type: ADD_KEHU_ERROR, payload: e });
    }
  };
}

export function updateKehu(id, data) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: UPDATE_KEHU });
      const kehu = await put(`/kehut/${id}`, data);
      dispatch({ type: UPDATE_KEHU_SUCCESS, payload: kehu });
      dispatch({
        type: RESET_REPORTS,
        payload: { kehus: getState().kehu.kehus },
      });
      dispatch(updateFeed());
    } catch (e) {
      dispatch({ type: UPDATE_KEHU_ERROR, payload: e });
    }
  };
}

export function removeKehu(id) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: REMOVE_KEHU });
      await del(`/kehut/${id}`);
      dispatch({ type: REMOVE_KEHU_SUCCESS, payload: id });
      dispatch({
        type: RESET_REPORTS,
        payload: { kehus: getState().kehu.kehus },
      });
      dispatch(updateFeed());
    } catch (e) {
      dispatch({ type: REMOVE_KEHU_ERROR, payload: e });
    }
  };
}

export function getKehus() {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_KEHUS });
      const payload = await get("/kehut");
      dispatch({ type: GET_KEHUS_SUCCESS, payload });
    } catch (e) {
      dispatch({ type: GET_KEHUS_ERROR, payload: e });
    }
  };
}

export function sendKehu(data) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: SEND_KEHU });
      const isGroupKehu = typeof data.group_id === "number";
      const kehu = isGroupKehu
        ? await post("/kehut/group", data)
        : await post("/kehut/laheta", data);

      // If kehu type was group kehu update groups
      // Could be optimized to only update the specific group but performance is
      // currently no issue
      if (isGroupKehu) dispatch(getGroups());

      dispatch({ type: SEND_KEHU_SUCCESS, payload: kehu });
      dispatch({
        type: RESET_REPORTS,
        payload: {
          kehus: getState().kehu.kehus,
          sent_kehus: getState().kehu.sentKehus,
        },
      });
      dispatch(updateFeed());
    } catch (e) {
      dispatch({ type: SEND_KEHU_ERROR, payload: e });
    }
  };
}

export function claimKehu(id) {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: CLAIM_KEHU });
      const kehu = await get(`/kehut/lisaa/${id}`);
      dispatch({ type: CLAIM_KEHU_SUCCESS, payload: kehu });
      dispatch({
        type: RESET_REPORTS,
        payload: { kehus: getState().kehu.kehus },
      });
      dispatch(updateFeed());
    } catch (e) {
      dispatch({ type: CLAIM_KEHU_ERROR, payload: e });
    }
  };
}

export function resetKehuFormState() {
  return { type: RESET_KEHU_FORM };
}

function addKehuToState(kehus, kehu) {
  return [...kehus, kehu].sort((a, b) => {
    const aMoment = moment(a.date_given);
    const bMoment = moment(b.date_given);
    return aMoment.isAfter(bMoment) ? -1 : 1;
  });
}

function updateKehuInState(kehus, kehu) {
  return kehus.map((k) => (k.id === kehu.id ? kehu : k));
}

function removeKehuFromState(kehus, removedId) {
  return kehus.filter((k) => k.id !== removedId);
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_KEHU:
    case GET_KEHUS:
    case UPDATE_KEHU:
    case SEND_KEHU:
    case CLAIM_KEHU:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        savedKehu: action.payload.kehu,
        kehus: addKehuToState(state.kehus, action.payload.kehu),
      };
    case UPDATE_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        savedKehu: action.payload.kehu,
        kehus: updateKehuInState(state.kehus, action.payload.kehu),
      };

    case ADD_KEHU_ERROR:
    case UPDATE_KEHU_ERROR:
    case SEND_KEHU_ERROR:
    case CLAIM_KEHU_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RESET_KEHU_FORM:
      return {
        ...state,
        loading: false,
        error: null,
        savedKehu: null,
        sendKehuSuccess: false,
        claimKehuSuccess: false,
      };

    case REMOVE_KEHU:
      return {
        ...state,
        loading: true,
        removeKehuError: null,
        error: null,
      };

    case REMOVE_KEHU_ERROR:
      return {
        ...state,
        loading: false,
        removeKehuError: action.payload,
      };

    case REMOVE_KEHU_SUCCESS:
      return {
        ...state,
        kehus: removeKehuFromState(state.kehus, action.payload),
        loading: false,
        error: null,
        removeKehuError: null,
      };

    case SEND_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        sendKehuSuccess: true,
        sentKehus: addKehuToState(state.sentKehus, action.payload.kehu),
      };

    case CLAIM_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        claimKehuSuccess: true,
        kehus: addKehuToState(state.kehus, action.payload.kehu),
      };

    case GET_KEHUS_SUCCESS:
      return {
        ...state,
        loading: false,
        kehus: action.payload.kehus,
        sentKehus: action.payload.sent_kehus,
        kehusLoaded: true,
      };
    case GET_KEHUS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        kehusLoaded: true,
      };

    default:
      return state;
  }
}
