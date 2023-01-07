import { get, post, put } from "../util/ApiUtil";

export const GET_GROUPS = "groups/GET_GROUPS";
export const GET_GROUPS_SUCCESS = "groups/GET_GROUPS_SUCCESS";
export const GET_GROUPS_ERROR = "groups/GET_GROUPS_ERROR";

export const CREATE_GROUP = "group/CREATE_GROUP";
export const CREATE_GROUP_SUCCESS = "group/CREATE_GROUP_SUCCESS";
export const CREATE_GROUP_ERROR = "group/CREATE_GROUP_ERROR";

export const UPDATE_GROUP_NAME = "group/UPDATE_GROUP_NAME";
export const UPDATE_GROUP_NAME_SUCCESS = "group/UPDATE_GROUP_NAME_SUCCESS";
export const UPDATE_GROUP_NAME_ERROR = "group/UPDATE_GROUP_NAME_ERROR";

export const INVITE_GROUP_MEMBERS = "group/INVITE_GROUP_MEMBERS";
export const INVITE_GROUP_MEMBERS_SUCCESS =
  "group/INVITE_GROUP_MEMBERS_SUCCESS";
export const INVITE_GROUP_MEMBERS_ERROR = "group/INVITE_GROUP_MEMBERS_ERROR";

export const RESET_CREATE_GROUP_FORM = "group/RESET_CREATE_GROUP_FORM";
export const SELECT_GROUP = "group/SELECT_GROUP";

export const initialState = {
  error: null,
  loading: false,
  groups: [],
  activeGroupIdx: null,
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

// history and to parameters are optional and used to redirect after succesful
// update
export function updateGroupName({ id, name, description }, history, to) {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_GROUP_NAME });
      const group = await put(`/yhteisot/${id}`, { name, description });
      dispatch({ type: UPDATE_GROUP_NAME_SUCCESS, payload: group });
      if (history && to) history.push(to);
    } catch (e) {
      dispatch({ type: UPDATE_GROUP_NAME_ERROR, payload: e });
    }
  };
}

// `cb` callback function is used to close modal when inviting members in
// admin view
export function inviteGroupMembers(groupId, members, cb) {
  return async (dispatch) => {
    try {
      dispatch({ type: INVITE_GROUP_MEMBERS });
      const group = await post(`/yhteisot/${groupId}/members`, { members });
      dispatch({ type: INVITE_GROUP_MEMBERS_SUCCESS, payload: group });
      if (typeof cb === "function") cb();
    } catch (e) {
      dispatch({ type: INVITE_GROUP_MEMBERS_ERROR, payload: e });
    }
  };
}

export function resetCreateGroupForm() {
  return { type: RESET_CREATE_GROUP_FORM };
}

// If both parameters are defined then `groupId` is used
export function selectGroup({ groupId, groupIdx }) {
  return { type: SELECT_GROUP, payload: { groupId, groupIdx } };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_GROUPS:
    case CREATE_GROUP:
    case UPDATE_GROUP_NAME:
    case INVITE_GROUP_MEMBERS:
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
        activeGroupIdx: 0,
        groupsLoaded: true,
      };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        groups: [...state.groups, action.payload],
        activeGroupIdx: state.groups.length,
        groupsLoaded: true,
      };

    case UPDATE_GROUP_NAME_SUCCESS:
    case INVITE_GROUP_MEMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        groups: state.groups.map((group) =>
          group.id === action.payload.id ? action.payload : group
        ),
      };

    case GET_GROUPS_ERROR:
    case CREATE_GROUP_ERROR:
    case UPDATE_GROUP_NAME_ERROR:
    case INVITE_GROUP_MEMBERS_ERROR:
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

    case SELECT_GROUP:
      return {
        ...state,
        activeGroupIdx:
          action.payload.groupId != null
            ? state.groups.findIndex((g) => g.id === action.payload.groupId)
            : action.payload.groupIdx,
      };

    default:
      return state;
  }
}
