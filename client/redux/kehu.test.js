import reducer, {
  initialState,
  ADD_KEHU,
  ADD_KEHU_ERROR,
  ADD_KEHU_SUCCESS,
  addKehu
} from "./kehu";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("client:redux:kehu", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on ADD_KEHU", () => {
      const state = { ...initialState, error: new Error() };
      const action = { type: ADD_KEHU };
      const expectedState = { ...state, loading: true, error: null };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on ADD_KEHU_SUCCESS", () => {
      const state = { ...initialState, loading: true, error: new Error() };
      const kehu = { kehu: 1 };
      const action = { type: ADD_KEHU_SUCCESS, payload: kehu };
      const expectedState = {
        ...state,
        loading: false,
        error: null,
        kehus: [kehu]
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on ADD_KEHU_ERROR", () => {
      const state = { ...initialState, loading: true, error: null };
      const error = new Error("kehu error");
      const action = { type: ADD_KEHU_ERROR, payload: error };
      const expectedState = { ...state, loading: false, error };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("addKehu", () => {
      it("when adding succeeds", () => {
        const data = { form: 1 };
        const response = { response: 1 };
        fetch.mockResponse(JSON.stringify(response), 200);

        const store = mockStore(initialState);
        const expectedActions = [
          { type: ADD_KEHU },
          { type: ADD_KEHU_SUCCESS, payload: response }
        ];

        store.dispatch(addKehu(data)).then(() => {
          expect(fetch.mock.calls[0]).toEqual([
            "/api/v1/kehu",
            {
              method: "POST",
              body: data
            }
          ]);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it("when adding fails", () => {
        const data = { form: 1 };
        const error = new Error("network error");
        fetch.mockReject(error);

        const store = mockStore(initialState);
        const expectedActions = [
          { type: ADD_KEHU },
          { type: ADD_KEHU_ERROR, payload: error }
        ];

        store.dispatch(addKehu(data)).then(() => {
          expect(fetch.mock.calls[0]).toEqual([
            "/api/v1/kehu",
            {
              method: "POST",
              body: data
            }
          ]);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });
});
