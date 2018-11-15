import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  initialState,
  PROFILE_LOADED,
  PROFILE_ERROR,
  getProfile
} from "./user";

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
          fetch.mockResponse(JSON.stringify(response));

          const store = mockStore(initialState);
          const expectedActions = [{ type: PROFILE_LOADED, payload: response }];

          store.dispatch(getProfile()).then(() => {
            expect(fetch.mock.calls[0][0]).toEqual("/api/v1/user");
            expect(store.getActions()).toEqual(expectedActions);
          });
        });
      });

      describe("when call fails", () => {
        it("dispatches error", () => {
          const error = new Error("network error");
          fetch.mockReject(error);

          const store = mockStore(initialState);
          const expectedActions = [
            { type: PROFILE_ERROR, payload: error.message }
          ];

          store.dispatch(getProfile()).then(() => {
            expect(fetch.mock.calls[0][0]).toEqual("/api/v1/user");
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
