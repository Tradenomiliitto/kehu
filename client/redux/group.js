import { get, post } from "../util/ApiUtil";

export const GET_GROUPS = "groups/GET_GROUPS";
export const GET_GROUPS_SUCCESS = "groups/GET_GROUPS_SUCCESS";
export const GET_GROUPS_ERROR = "groups/GET_GROUPS_ERROR";

export const CREATE_GROUP = "group/CREATE_GROUP";
export const CREATE_GROUP_SUCCESS = "group/CREATE_GROUP_SUCCESS";
export const CREATE_GROUP_ERROR = "group/CREATE_GROUP_ERROR";
export const RESET_CREATE_GROUP_FORM = "group/RESET_CREATE_GROUP_FORM";

export const initialState = {
  error: null,
  loading: false,
  groups: [],
  groupsLoaded: false,
};

export function getGroups() {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_GROUPS });
      const payload = await get("/yhteisot");
      dispatch({ type: GET_GROUPS_SUCCESS, payload });
    } catch (e) {
      dispatch({ type: GET_GROUPS_ERROR, payload: e });
    }
  };
}

export function createGroup(data) {
  return async (dispatch) => {
    try {
      dispatch({ type: CREATE_GROUP });
      const group = await post("/yhteisot", data);
      dispatch({ type: CREATE_GROUP_SUCCESS, payload: group });
    } catch (e) {
      dispatch({ type: CREATE_GROUP_ERROR, payload: e });
    }
  };
}

export function resetCreateGroupForm() {
  return { type: RESET_CREATE_GROUP_FORM };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_GROUPS:
    case CREATE_GROUP:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        groups: action.payload,
        groupsLoaded: true,
      };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        groups: [...state.groups, action.payload],
        groupsLoaded: true,
      };

    case GET_GROUPS_ERROR:
    case CREATE_GROUP_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RESET_CREATE_GROUP_FORM:
      return {
        ...state,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}
