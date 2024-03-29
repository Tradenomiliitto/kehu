import { get, post, put, del } from "../util/ApiUtil";

export const GET_GROUPS = "groups/GET_GROUPS";
export const GET_GROUPS_SUCCESS = "groups/GET_GROUPS_SUCCESS";
export const GET_GROUPS_ERROR = "groups/GET_GROUPS_ERROR";

export const ADD_GROUP = "group/ADD_GROUP";

export const CREATE_GROUP = "group/CREATE_GROUP";
export const CREATE_GROUP_SUCCESS = "group/CREATE_GROUP_SUCCESS";
export const CREATE_GROUP_ERROR = "group/CREATE_GROUP_ERROR";

export const UPDATE_GROUP = "group/UPDATE_GROUP_NAME";
export const UPDATE_GROUP_SUCCESS = "group/UPDATE_GROUP_NAME_SUCCESS";
export const UPDATE_GROUP_ERROR = "group/UPDATE_GROUP_NAME_ERROR";

export const DELETE_GROUP = "group/DELETE_GROUP_NAME";
export const DELETE_GROUP_SUCCESS = "group/DELETE_GROUP_NAME_SUCCESS";
export const DELETE_GROUP_ERROR = "group/DELETE_GROUP_NAME_ERROR";

export const INVITE_GROUP_MEMBERS = "group/INVITE_GROUP_MEMBERS";
export const INVITE_GROUP_MEMBERS_SUCCESS =
  "group/INVITE_GROUP_MEMBERS_SUCCESS";
export const INVITE_GROUP_MEMBERS_ERROR = "group/INVITE_GROUP_MEMBERS_ERROR";

export const DELETE_INVITATION = "group/DELETE_INVITATION";
export const DELETE_INVITATION_SUCCESS = "group/DELETE_INVITATION_SUCCESS";
export const DELETE_INVITATION_ERROR = "group/DELETE_INVITATION_ERROR";

export const REMOVE_GROUP_MEMBER = "group/REMOVE_GROUP_MEMBER";
export const REMOVE_GROUP_MEMBER_SUCCESS = "group/REMOVE_GROUP_MEMBER_SUCCESS";
export const REMOVE_GROUP_MEMBER_ERROR = "group/REMOVE_GROUP_MEMBER_ERROR";

export const UPDATE_GROUP_MEMBER = "group/UPDATE_GROUP_MEMBER";
export const UPDATE_GROUP_MEMBER_SUCCESS = "group/UPDATE_GROUP_MEMBER_SUCCESS";
export const UPDATE_GROUP_MEMBER_ERROR = "group/UPDATE_GROUP_MEMBER_ERROR";

export const RESET_GROUP_ERRORS = "group/RESET_GROUP_ERRORS";
export const SELECT_GROUP = "group/SELECT_GROUP";

export const initialState = {
  error: null,
  loading: false,
  groups: [],
  activeGroupId: null,
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

// `cb` callback function is used to close modal when creating a group
export function createGroup(data, cb) {
  return async (dispatch) => {
    try {
      dispatch({ type: CREATE_GROUP });
      const group = await post("/yhteisot", data);
      dispatch({ type: CREATE_GROUP_SUCCESS, payload: group });
      if (typeof cb === "function") cb();
    } catch (e) {
      dispatch({ type: CREATE_GROUP_ERROR, payload: e });
    }
  };
}

// `history` and `to` parameters are optional and used to redirect after succesful
// update, optional `cb` callback function is used to close modal
export function updateGroup(
  { id, name, description, picture, cloudinaryPublicId },
  { history, to, cb },
) {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_GROUP });
      const group = await put(`/yhteisot/${id}`, {
        name,
        description,
        picture,
        cloudinaryPublicId,
      });
      dispatch({ type: UPDATE_GROUP_SUCCESS, payload: group });
      if (history && to) history.push(to);
      if (typeof cb === "function") cb();
    } catch (e) {
      dispatch({ type: UPDATE_GROUP_ERROR, payload: e });
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

// `cb` callback function is used to close modal when removing members in
// admin view
export function removeGroupMember(groupId, memberId, cb) {
  return async (dispatch) => {
    try {
      dispatch({ type: REMOVE_GROUP_MEMBER });
      const res = await del(`/yhteisot/${groupId}/members/${memberId}`);
      const group = await res.json();

      // If returned group is empty then the user was removed from the group
      if (group == null)
        dispatch({ type: DELETE_GROUP_SUCCESS, payload: { groupId } });
      else dispatch({ type: REMOVE_GROUP_MEMBER_SUCCESS, payload: group });
      if (typeof cb === "function") cb();
    } catch (e) {
      dispatch({ type: REMOVE_GROUP_MEMBER_ERROR, payload: e });
    }
  };
}

// `cb` callback function is used to close modal when updating members in
// admin view
export function updateGroupMember(groupId, memberId, isAdmin, cb) {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_GROUP_MEMBER });
      const group = await put(`/yhteisot/${groupId}/members/${memberId}`, {
        isAdmin,
      });
      dispatch({ type: UPDATE_GROUP_MEMBER_SUCCESS, payload: group });
      if (typeof cb === "function") cb();
    } catch (e) {
      dispatch({ type: UPDATE_GROUP_MEMBER_ERROR, payload: e });
    }
  };
}

// `cb` callback function is used to close modal when deleting invitations in
// admin view
export function deleteInvitation(groupId, invitationId, cb) {
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_INVITATION });
      const res = await del(`/yhteisot/${groupId}/invitations/${invitationId}`);
      const group = await res.json();

      dispatch({ type: DELETE_INVITATION_SUCCESS, payload: group });
      if (typeof cb === "function") cb();
    } catch (e) {
      dispatch({ type: DELETE_INVITATION_ERROR, payload: e });
    }
  };
}

export function resetGroupErrors() {
  return { type: RESET_GROUP_ERRORS };
}

// If both parameters are defined then `groupId` is used
export function selectGroup({ groupId, groupIdx }) {
  return { type: SELECT_GROUP, payload: { groupId, groupIdx } };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_GROUPS:
    case CREATE_GROUP:
    case UPDATE_GROUP:
    case INVITE_GROUP_MEMBERS:
    case REMOVE_GROUP_MEMBER:
    case UPDATE_GROUP_MEMBER:
    case DELETE_INVITATION:
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
        activeGroupId: null,
        groupsLoaded: true,
      };

    case CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        groups: [...state.groups, action.payload],
        activeGroupId: action.payload.id,
        groupsLoaded: true,
      };

    case ADD_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.payload],
        activeGroupId: action.payload.id,
      };

    case UPDATE_GROUP_SUCCESS:
    case INVITE_GROUP_MEMBERS_SUCCESS:
    case REMOVE_GROUP_MEMBER_SUCCESS:
    case UPDATE_GROUP_MEMBER_SUCCESS:
    case DELETE_INVITATION_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        groups: state.groups.map((group) =>
          group.id === action.payload.id ? action.payload : group,
        ),
      };

    case DELETE_GROUP_SUCCESS: {
      const groups = state.groups.filter(
        (group) => group.id !== action.payload.groupId,
      );
      return {
        ...state,
        loading: false,
        error: null,
        groups: groups,
        activeGroupId: null,
        groupsLoaded: true,
      };
    }

    case GET_GROUPS_ERROR:
    case CREATE_GROUP_ERROR:
    case UPDATE_GROUP_ERROR:
    case INVITE_GROUP_MEMBERS_ERROR:
    case REMOVE_GROUP_MEMBER_ERROR:
    case UPDATE_GROUP_MEMBER_ERROR:
    case DELETE_GROUP_ERROR:
    case DELETE_INVITATION_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RESET_GROUP_ERRORS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case SELECT_GROUP:
      return {
        ...state,
        activeGroupId:
          action.payload.groupId ?? state.groups[action.payload.groupIdx]?.id,
      };

    default:
      return state;
  }
}
