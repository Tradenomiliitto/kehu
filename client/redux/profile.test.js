import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  initialState,
  PROFILE_LOADED,
  PROFILE_ERROR,
  getProfile
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
      const payload = {
        profile: { user: 1 },
        roles: [{ id: 1 }],
        situations: [newSituation],
        tags: [newTag]
      };
      const action = { type: PROFILE_LOADED, payload };
      const expectedState = {
        ...state,
        profile: payload.profile,
        profileLoaded: true,
        roles: payload.roles,
        situations: payload.situations,
        tags: payload.tags
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
  });

  describe("actions", () => {
    describe("getProfile", () => {
      describe("when call succeeds", () => {
        it("dispatches user profile", () => {
          const response = { profile: { user: 1 }, roles: [{ id: 1 }] };
          ApiUtil.get = jest.fn(() => new Promise(res => res(response)));

          const store = mockStore(initialState);
          const expectedActions = [{ type: PROFILE_LOADED, payload: response }];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/profiili");
            expect(store.getActions()).toEqual(expectedActions);
          });
        });
      });

      describe("when call fails", () => {
        it("dispatches error", () => {
          const error = new Error("network error");
          ApiUtil.get = jest.fn(() => new Promise((res, rej) => rej(error)));

          const store = mockStore(initialState);
          const expectedActions = [
            { type: PROFILE_ERROR, payload: error.message }
          ];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/profiili");
            expect(store.getActions()).toEqual(expectedActions);
          });
        });
      });
    });
  });
});
