import reducer, {
  initialState,
  ADD_KEHU,
  ADD_KEHU_ERROR,
  ADD_KEHU_SUCCESS,
  addKehu,
  resetAddKehuState,
  ADD_KEHU_RESET
} from "./kehu";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import * as ApiUtil from "../util/ApiUtil";

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
      const action = { type: ADD_KEHU_SUCCESS, payload: { kehu } };
      const expectedState = {
        ...state,
        loading: false,
        addedKehu: kehu,
        error: null
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

    it("on ADD_KEHU_RESET", () => {
      const state = {
        ...initialState,
        loading: true,
        error: true,
        addedKehu: {}
      };
      const action = { type: ADD_KEHU_RESET };
      const expectedState = {
        ...state,
        loading: false,
        error: null,
        addedKehu: null
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("addKehu", () => {
      it("when adding succeeds", () => {
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.post = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: ADD_KEHU },
          { type: ADD_KEHU_SUCCESS, payload: response }
        ];

        store.dispatch(addKehu(data)).then(() => {
          expect(ApiUtil.post).toBeCalledWith("/kehut", data);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it("when adding fails", () => {
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.post = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: ADD_KEHU },
          { type: ADD_KEHU_ERROR, payload: error }
        ];

        store.dispatch(addKehu(data)).then(() => {
          expect(ApiUtil.post).toBeCalledWith("/kehut", data);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe("resetAddKehuState", () => {
      it("returns correct action", () => {
        expect(resetAddKehuState()).toEqual({ type: ADD_KEHU_RESET });
      });
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });
});
