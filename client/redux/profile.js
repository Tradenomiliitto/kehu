import { get, put } from "../util/ApiUtil";

export const PROFILE_LOADED = "profile/PROFILE_LOADED";
export const PROFILE_ERROR = "profile/PROFILE_ERROR";

export const UPDATE_PROFILE = "profile/UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "profile/UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_ERROR = "profile/UPDATE_PROFILE_ERROR";

export const initialState = {
  error: null,
  loading: false,
  profile: undefined,
  profileLoaded: false,
  contacts: [],
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

export function updateProfile(data) {
  return async dispatch => {
    try {
      dispatch({ type: UPDATE_PROFILE });
      const payload = await put("/profiili", data);
      dispatch({ type: UPDATE_PROFILE_SUCCESS, payload });
    } catch (e) {
      dispatch({ type: UPDATE_PROFILE_ERROR, payload: e.message });
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

    default:
      return state;
  }
}
