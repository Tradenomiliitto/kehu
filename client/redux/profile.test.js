import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  initialState,
  PROFILE_LOADED,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  getProfile,
  updateProfile,
  DELETE_PROFILE,
  DELETE_PROFILE_ERROR,
  DELETE_PROFILE_SUCCESS,
  deleteProfile
} from "./profile";
import * as ApiUtil from "../util/ApiUtil";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("client:redux:profile", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on PROFILE_LOADED", () => {
      const state = initialState;
      const newSituation = { text: "situation1" };
      const newTag = { text: "tag1" };
      const feedItem = { item: 1 };
      const payload = {
        profile: { user: 1 },
        contacts: [{ name: "name" }],
        roles: [{ id: 1 }],
        situations: [newSituation],
        tags: [newTag],
        feed: [feedItem]
      };
      const action = { type: PROFILE_LOADED, payload };
      const expectedState = {
        ...state,
        profile: payload.profile,
        profileLoaded: true,
        contacts: payload.contacts,
        roles: payload.roles,
        situations: payload.situations,
        tags: payload.tags,
        feedItems: payload.feed
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on PROFILE_ERROR", () => {
      const state = initialState;
      const error = "error message";
      const action = { type: PROFILE_ERROR, payload: error };
      const expectedState = { ...state, error, profileLoaded: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_PROFILE", () => {
      const state = { ...initialState, updateProfileError: true };
      const action = { type: UPDATE_PROFILE };
      const expectedState = {
        ...state,
        loading: true,
        updateProfileError: null
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_PROFILE_SUCCESS", () => {
      const profile = { profile: "updated" };
      const state = { ...initialState, loading: true };
      const action = { type: UPDATE_PROFILE_SUCCESS, payload: profile };
      const expectedState = { ...state, profile, loading: false };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_PROFILE_ERROR", () => {
      const error = new Error("random error");
      const state = { ...initialState, loading: true };
      const action = { type: UPDATE_PROFILE_ERROR, payload: error };
      const expectedState = {
        ...state,
        loading: false,
        updateProfileError: action.payload
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on DELETE_PROFILE", () => {
      const state = { ...initialState, deleteProfileError: true };
      const action = { type: DELETE_PROFILE };
      const expectedState = {
        ...state,
        loading: true,
        deleteProfileError: null
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on DELETE_PROFILE_SUCCESS", () => {
      const state = { ...initialState, loading: true };
      const action = { type: DELETE_PROFILE_SUCCESS };
      const expectedState = { ...state, loading: false };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on DELETE_PROFILE_ERROR", () => {
      const error = new Error("random error");
      const state = { ...initialState, loading: true };
      const action = { type: DELETE_PROFILE_ERROR, payload: error };
      const expectedState = {
        ...state,
        loading: false,
        deleteProfileError: action.payload
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("getProfile", () => {
      describe("when call succeeds", () => {
        it("dispatches user profile", done => {
          const response = { profile: { user: 1 }, roles: [{ id: 1 }] };
          ApiUtil.get = jest.fn(() => new Promise(res => res(response)));

          const store = mockStore(initialState);
          const expectedActions = [{ type: PROFILE_LOADED, payload: response }];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/profiili");
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
        });
      });

      describe("when call fails", () => {
        it("dispatches error", done => {
          const error = new Error("network error");
          ApiUtil.get = jest.fn(() => new Promise((res, rej) => rej(error)));

          const store = mockStore(initialState);
          const expectedActions = [
            { type: PROFILE_ERROR, payload: error.message }
          ];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/profiili");
            expect(store.getActions()).toEqual(expectedActions);
            done();
          });
        });
      });
    });

    describe("updateProfile", () => {
      it("when updating succeeds", done => {
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.put = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore({ profile: initialState });
        const expectedActions = [
          { type: UPDATE_PROFILE },
          { type: UPDATE_PROFILE_SUCCESS, payload: response }
        ];

        store.dispatch(updateProfile(data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/profiili`, data);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when updating fails", done => {
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.put = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: UPDATE_PROFILE },
          { type: UPDATE_PROFILE_ERROR, payload: error }
        ];

        store.dispatch(updateProfile(data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/profiili`, data);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe("deleteProfile", () => {
      it("when deleting succeeds", done => {
        const response = { success: true };

        ApiUtil.del = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore({ profile: initialState });
        const expectedActions = [
          { type: DELETE_PROFILE },
          { type: DELETE_PROFILE_SUCCESS }
        ];

        store.dispatch(deleteProfile()).then(() => {
          expect(ApiUtil.del).toBeCalledWith(`/profiili`);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when updating fails", done => {
        const error = new Error("network error");
        ApiUtil.del = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: DELETE_PROFILE },
          { type: DELETE_PROFILE_ERROR, payload: error }
        ];

        store.dispatch(deleteProfile()).then(() => {
          expect(ApiUtil.del).toBeCalledWith(`/profiili`);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });
});
