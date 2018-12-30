import reducer, {
  initialState,
  ADD_KEHU,
  ADD_KEHU_ERROR,
  ADD_KEHU_SUCCESS,
  addKehu,
  removeKehu,
  getKehus,
  resetKehuFormState,
  GET_KEHUS,
  GET_KEHUS_SUCCESS,
  GET_KEHUS_ERROR,
  REMOVE_KEHU,
  REMOVE_KEHU_SUCCESS,
  REMOVE_KEHU_ERROR,
  UPDATE_KEHU_ERROR,
  UPDATE_KEHU_SUCCESS,
  UPDATE_KEHU,
  RESET_KEHU_FORM,
  updateKehu
} from "./kehu";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import * as ApiUtil from "../util/ApiUtil";
import { TOGGLE_ADD_KEHU_FORM_MODAL } from "./portal";
import { RESET_REPORTS } from "./report";

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
      const kehus = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const state = {
        ...initialState,
        loading: true,
        error: new Error(),
        kehus
      };
      const kehu = { id: 4 };
      const action = { type: ADD_KEHU_SUCCESS, payload: { kehu } };
      const expectedState = {
        ...state,
        loading: false,
        savedKehu: kehu,
        error: null,
        kehus: kehus.concat(kehu)
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

    it("on UPDATE_KEHU", () => {
      const state = { ...initialState, error: new Error() };
      const action = { type: UPDATE_KEHU };
      const expectedState = { ...state, loading: true, error: null };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_KEHU_SUCCESS", () => {
      const updatedKehu = { id: 2, name: "jooh" };
      const kehus = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const state = {
        ...initialState,
        loading: true,
        error: new Error(),
        kehus
      };
      const action = {
        type: UPDATE_KEHU_SUCCESS,
        payload: { kehu: updatedKehu }
      };
      const expectedState = {
        ...state,
        loading: false,
        savedKehu: updatedKehu,
        error: null,
        kehus: [{ id: 1 }, updatedKehu, { id: 3 }]
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on UPDATE_KEHU_ERROR", () => {
      const state = { ...initialState, loading: true, error: null };
      const error = new Error("kehu error");
      const action = { type: UPDATE_KEHU_ERROR, payload: error };
      const expectedState = { ...state, loading: false, error };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on RESET_KEHU_FORM", () => {
      const state = {
        ...initialState,
        loading: true,
        error: true,
        savedKehu: {}
      };
      const action = { type: RESET_KEHU_FORM };
      const expectedState = {
        ...state,
        loading: false,
        error: null,
        savedKehu: null
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on REMOVE_KEHU", () => {
      const state = { ...initialState, error: new Error() };
      const action = { type: REMOVE_KEHU };
      const expectedState = { ...state, loading: true, error: null };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on REMOVE_KEHU_SUCCESS", () => {
      const kehuId = 2;
      const kehus = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const expectedKehus = [{ id: 1 }, { id: 3 }];
      const state = {
        ...initialState,
        loading: true,
        error: new Error(),
        kehus
      };
      const action = { type: REMOVE_KEHU_SUCCESS, payload: kehuId };
      const expectedState = {
        ...state,
        loading: false,
        kehus: expectedKehus,
        error: null
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on REMOVE_KEHU_ERROR", () => {
      const kehus = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const state = { ...initialState, loading: true, error: null, kehus };
      const error = new Error("kehu error");
      const action = { type: REMOVE_KEHU_ERROR, payload: error };
      const expectedState = { ...state, loading: false, error };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on GET_KEHUS", () => {
      const state = { ...initialState };
      const action = { type: GET_KEHUS };
      const expectedState = { ...state, loading: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on GET_KEHUS_SUCCESS", () => {
      const state = { ...state, loading: true };
      const kehus = [{ id: 1 }, { id: 2 }];
      const action = { type: GET_KEHUS_SUCCESS, payload: kehus };
      const expectedState = {
        ...state,
        loading: false,
        kehus,
        kehusLoaded: true
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on GET_KEHUS_ERROR", () => {
      const state = { ...state, loading: true };
      const error = new Error("error");
      const action = { type: GET_KEHUS_ERROR, payload: error };
      const expectedState = {
        ...state,
        loading: false,
        error,
        kehusLoaded: true
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

    describe("updateKehu", () => {
      it("when updating succeeds", () => {
        const kehuId = 3;
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.put = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore({ kehu: initialState });
        const expectedActions = [
          { type: UPDATE_KEHU },
          { type: UPDATE_KEHU_SUCCESS, payload: response },
          { type: RESET_REPORTS, payload: [] }
        ];

        store.dispatch(updateKehu(kehuId, data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/kehut/${kehuId}`, data);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it("when adding fails", () => {
        const kehuId = 3;
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.put = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: UPDATE_KEHU },
          { type: UPDATE_KEHU_ERROR, payload: error }
        ];

        store.dispatch(updateKehu(kehuId, data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/kehut/${kehuId}`, data);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe("removeKehu", () => {
      it("when adding succeeds", () => {
        const kehuId = 1;
        const response = { response: 1 };

        ApiUtil.del = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore({ kehu: initialState });
        const expectedActions = [
          { type: REMOVE_KEHU },
          { type: REMOVE_KEHU_SUCCESS, payload: kehuId },
          { type: RESET_REPORTS, payload: [] }
        ];

        store.dispatch(removeKehu(kehuId)).then(() => {
          expect(ApiUtil.del).toBeCalledWith(`/kehut/${kehuId}`);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it("when adding fails", () => {
        const kehuId = 1;
        const error = new Error("network error");
        ApiUtil.del = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: REMOVE_KEHU },
          { type: REMOVE_KEHU_ERROR, payload: error }
        ];

        store.dispatch(removeKehu(kehuId)).then(() => {
          expect(ApiUtil.del).toBeCalledWith(`/kehut/${kehuId}`);
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });

    describe("resetKehuFormState", () => {
      it("returns correct action", () => {
        const store = mockStore(initialState);
        const expectedActions = [
          { type: RESET_KEHU_FORM },
          { type: TOGGLE_ADD_KEHU_FORM_MODAL }
        ];
        store.dispatch(resetKehuFormState());
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe("getKehus", () => {
      it("when fetching succeeds", () => {
        const response = [{ id: 1 }, { id: 2 }];
        ApiUtil.get = jest.fn(() => new Promise(res => res(response)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: GET_KEHUS },
          { type: GET_KEHUS_SUCCESS, payload: response }
        ];

        store.dispatch(getKehus()).then(() => {
          expect(ApiUtil.get).toBeCalledWith("/kehut");
          expect(store.getActions()).toEqual(expectedActions);
        });
      });

      it("when fetching fails", () => {
        const error = new Error("network error");
        ApiUtil.get = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: GET_KEHUS },
          { type: GET_KEHUS_ERROR, payload: error }
        ];

        store.dispatch(getKehus()).then(() => {
          expect(ApiUtil.get).toBeCalledWith("/kehut");
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });
});
