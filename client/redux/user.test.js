import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  initialState,
  PROFILE_LOADED,
  PROFILE_ERROR,
  getProfile
} from "./user";
import * as ApiUtil from "../util/ApiUtil";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("client:redux:user", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on PROFILE_LOADED", () => {
      const state = initialState;
      const user = { user: 1 };
      const action = { type: PROFILE_LOADED, payload: user };
      const expectedState = { ...state, user };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on PROFILE_ERROR", () => {
      const state = initialState;
      const error = "error message";
      const action = { type: PROFILE_ERROR, payload: error };
      const expectedState = { ...state, error };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("getProfile", () => {
      describe("when call succeeds", () => {
        it("dispatches user profile", () => {
          const response = { user: 1 };
          ApiUtil.get = jest.fn(() => new Promise(res => res(response)));

          const store = mockStore(initialState);
          const expectedActions = [{ type: PROFILE_LOADED, payload: response }];

          store.dispatch(getProfile()).then(() => {
            expect(ApiUtil.get).toBeCalledWith("/user");
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
            expect(ApiUtil.get).toBeCalledWith("/user");
            expect(store.getActions()).toEqual(expectedActions);
          });
        });
      });
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });
});