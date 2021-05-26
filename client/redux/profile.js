import { del, get, put } from "../util/ApiUtil";

export const PROFILE_LOADED = "profile/PROFILE_LOADED";
export const PROFILE_ERROR = "profile/PROFILE_ERROR";
export const FEED_LOADED = "profile/FEED_LOADED";
export const FEED_ERROR = "profile/FEED_ERROR";

export const UPDATE_PROFILE = "profile/UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "profile/UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_ERROR = "profile/UPDATE_PROFILE_ERROR";

export const DELETE_PROFILE = "profile/DELETE_PROFILE";
export const DELETE_PROFILE_SUCCESS = "profile/DELETE_PROFILE_SUCCESS";
export const DELETE_PROFILE_ERROR = "profile/DELETE_PROFILE_ERROR";

export const initialState = {
  error: null,
  loading: false,
  profile: undefined,
  profileLoaded: false,
  contacts: [],
  feedItems: [],
  roles: [],
  situations: [],
  tags: [],
  updateProfileError: null
};

export function getProfile() {
  return async dispatch => {
    try {
      const payload = await get("/profiili");
      dispatch({ type: PROFILE_LOADED, payload });
    } catch (e) {
      dispatch({ type: PROFILE_ERROR, payload: e.message });
    }
  };
}

export function updateFeed() {
  return async dispatch => {
    try {
      const payload = await get("/profiili/feed");
      dispatch({ type: FEED_LOADED, payload });
    } catch (e) {
      dispatch({ type: FEED_ERROR, payload: e.message });
    }
  };
}

export function updateProfile(data, pictureOnly = false) {
  return async dispatch => {
    try {
      dispatch({ type: UPDATE_PROFILE });
      const url = pictureOnly ? "/profiili/kuva" : "/profiili";
      const payload = await put(url, data);
      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload });
    } catch (e) {
      dispatch({ type: UPDATE_PROFILE_ERROR, payload: e });
    }
  };
}

export function deleteProfile() {
  return async dispatch => {
    try {
      dispatch({ type: DELETE_PROFILE });
      await del("/profiili");
      dispatch({ type: DELETE_PROFILE_SUCCESS });
    } catch (e) {
      dispatch({ type: DELETE_PROFILE_ERROR, payload: e });
    }
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PROFILE_LOADED:
      return {
        ...state,
        profile: action.payload.profile,
        profileLoaded: true,
        contacts: action.payload.contacts,
        feedItems: action.payload.feed,
        roles: action.payload.roles,
        situations: action.payload.situations,
        tags: action.payload.tags
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        profileLoaded: true
      };
    case FEED_LOADED:
      return {
        ...state,
        feedItems: action.payload.feed
      };
    case FEED_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        loading: true,
        updateProfileError: null
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload
      };
    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        updateProfileError: action.payload
      };

    case DELETE_PROFILE:
      return {
        ...state,
        loading: true,
        deleteProfileError: null
      };
    case DELETE_PROFILE_SUCCESS:
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return {
        ...state,
        loading: false
      };
    case DELETE_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        deleteProfileError: action.payload
      };

    default:
      return state;
  }
}
