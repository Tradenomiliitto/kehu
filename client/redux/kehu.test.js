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
  updateKehu,
  SEND_KEHU,
  SEND_KEHU_SUCCESS,
  SEND_KEHU_ERROR,
  sendKehu,
  CLAIM_KEHU,
  CLAIM_KEHU_SUCCESS,
  CLAIM_KEHU_ERROR,
  claimKehu,
} from "./kehu";
import thunk from "redux-thunk";
import configureMockStore from "redux-mock-store";
import * as ApiUtil from "../util/ApiUtil";
import { RESET_REPORTS } from "./report";
import { FEED_LOADED, FEED_ERROR } from "./profile";

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
      const kehus = [
        { id: 1, date_given: "2019-01-02" },
        { id: 2, date_given: "2019-01-03" },
        { id: 3, date_given: "2019-01-04" },
      ];
      const state = {
        ...initialState,
        loading: true,
        error: new Error(),
        kehus,
      };
      const kehu = { id: 4, date_given: "2019-01-01" };
      const action = { type: ADD_KEHU_SUCCESS, payload: { kehu } };
      const expectedState = {
        ...state,
        loading: false,
        savedKehu: kehu,
        error: null,
        kehus: [...kehus.reverse(), kehu],
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
        kehus,
      };
      const action = {
        type: UPDATE_KEHU_SUCCESS,
        payload: { kehu: updatedKehu },
      };
      const expectedState = {
        ...state,
        loading: false,
        savedKehu: updatedKehu,
        error: null,
        kehus: [{ id: 1 }, updatedKehu, { id: 3 }],
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
        savedKehu: {},
        sendKehuSuccess: true,
        claimKehuSuccess: true,
      };
      const action = { type: RESET_KEHU_FORM };
      const expectedState = {
        ...state,
        loading: false,
        error: null,
        savedKehu: null,
        sendKehuSuccess: false,
        claimKehuSuccess: false,
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on REMOVE_KEHU", () => {
      const state = { ...initialState, removeKehuError: new Error() };
      const action = { type: REMOVE_KEHU };
      const expectedState = { ...state, loading: true, removeKehuError: null };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on REMOVE_KEHU_SUCCESS", () => {
      const kehuId = 2;
      const kehus = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const expectedKehus = [{ id: 1 }, { id: 3 }];
      const state = {
        ...initialState,
        loading: true,
        removeKehuError: new Error(),
        kehus,
      };
      const action = { type: REMOVE_KEHU_SUCCESS, payload: kehuId };
      const expectedState = {
        ...state,
        loading: false,
        kehus: expectedKehus,
        removeKehuError: null,
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on REMOVE_KEHU_ERROR", () => {
      const kehus = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const state = {
        ...initialState,
        loading: true,
        removeKehuError: null,
        kehus,
      };
      const error = new Error("kehu error");
      const action = { type: REMOVE_KEHU_ERROR, payload: error };
      const expectedState = {
        ...state,
        loading: false,
        removeKehuError: error,
      };
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
      const payload = {
        kehus: [{ id: 1 }, { id: 2 }],
        sent_kehus: [{ id: 3 }, { id: 4 }],
      };
      const action = { type: GET_KEHUS_SUCCESS, payload };
      const expectedState = {
        ...state,
        loading: false,
        kehus: payload.kehus,
        sentKehus: payload.sent_kehus,
        kehusLoaded: true,
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
        kehusLoaded: true,
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on SEND_KEHU", () => {
      const state = { ...initialState, error: new Error() };
      const action = { type: SEND_KEHU };
      const expectedState = { ...state, loading: true, error: null };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on SEND_KEHU_SUCCESS", () => {
      const sentKehus = [
        { id: 1, date_given: "2019-01-01" },
        { id: 2, date_given: "2019-01-03" },
      ];
      const state = {
        ...initialState,
        loading: true,
        error: new Error(),
        sentKehus,
      };
      const kehu = { id: 3, date_given: "2019-01-02" };
      const action = { type: SEND_KEHU_SUCCESS, payload: { kehu } };
      const expectedState = {
        ...state,
        loading: false,
        error: null,
        sendKehuSuccess: true,
        sentKehus: [sentKehus[1], kehu, sentKehus[0]],
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on SEND_KEHU_ERROR", () => {
      const state = { ...initialState, loading: true, error: null };
      const error = new Error("kehu error");
      const action = { type: SEND_KEHU_ERROR, payload: error };
      const expectedState = { ...state, loading: false, error };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on CLAIM_KEHU", () => {
      const state = { ...initialState, error: new Error() };
      const action = { type: CLAIM_KEHU };
      const expectedState = { ...state, loading: true, error: null };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on CLAIM_KEHU_SUCCESS", () => {
      const state = {
        ...initialState,
        loading: true,
        error: new Error(),
      };
      const kehu = { id: 3 };
      const action = { type: CLAIM_KEHU_SUCCESS, payload: { kehu } };
      const expectedState = {
        ...state,
        loading: false,
        error: null,
        claimKehuSuccess: true,
        kehus: [kehu],
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on CLAIM_KEHU_ERROR", () => {
      const state = { ...initialState, loading: true, error: null };
      const error = new Error("kehu error");
      const action = { type: CLAIM_KEHU_ERROR, payload: error };
      const expectedState = { ...state, loading: false, error };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("addKehu", () => {
      it("when adding succeeds", (done) => {
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.post = jest.fn(() => new Promise((res) => res(response)));
        ApiUtil.get = jest.fn(() => new Promise((res) => res(response)));

        // addKehu function requires full state
        const state = { kehu: { ...initialState } };
        const store = mockStore(state);
        const expectedActions = [
          { type: ADD_KEHU },
          { type: ADD_KEHU_SUCCESS, payload: response },
          { type: RESET_REPORTS, payload: { kehus: state.kehu.kehus } },
          { type: FEED_LOADED, payload: response },
        ];

        store.dispatch(addKehu(data)).then(() => {
          expect(ApiUtil.post).toBeCalledWith("/kehut", data);
          expect(ApiUtil.get).toBeCalledWith("/profiili/feed");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when adding fails", (done) => {
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.post = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: ADD_KEHU },
          { type: ADD_KEHU_ERROR, payload: error },
        ];

        store.dispatch(addKehu(data)).then(() => {
          expect(ApiUtil.post).toBeCalledWith("/kehut", data);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe("updateKehu", () => {
      it("when updating succeeds", (done) => {
        const kehuId = 3;
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.put = jest.fn(() => new Promise((res) => res(response)));
        ApiUtil.get = jest.fn(() => new Promise((res) => res(response)));

        const state = { kehu: { ...initialState, kehus: [{ kehu: 1 }] } };
        const store = mockStore(state);
        const expectedActions = [
          { type: UPDATE_KEHU },
          { type: UPDATE_KEHU_SUCCESS, payload: response },
          { type: RESET_REPORTS, payload: { kehus: state.kehu.kehus } },
          { type: FEED_LOADED, payload: response },
        ];

        store.dispatch(updateKehu(kehuId, data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/kehut/${kehuId}`, data);
          expect(ApiUtil.get).toBeCalledWith("/profiili/feed");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when updating fails", (done) => {
        const kehuId = 3;
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.put = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: UPDATE_KEHU },
          { type: UPDATE_KEHU_ERROR, payload: error },
        ];

        store.dispatch(updateKehu(kehuId, data)).then(() => {
          expect(ApiUtil.put).toBeCalledWith(`/kehut/${kehuId}`, data);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe("removeKehu", () => {
      it("when removing succeeds", (done) => {
        const kehuId = 1;
        const response = { response: 1 };

        ApiUtil.del = jest.fn(() => new Promise((res) => res(response)));
        ApiUtil.get = jest.fn(() => new Promise((res) => res(response)));

        const state = { kehu: { ...initialState, kehus: [{ kehu: 1 }] } };
        const store = mockStore(state);
        const expectedActions = [
          { type: REMOVE_KEHU },
          { type: REMOVE_KEHU_SUCCESS, payload: kehuId },
          { type: RESET_REPORTS, payload: { kehus: state.kehu.kehus } },
          { type: FEED_LOADED, payload: response },
        ];

        store.dispatch(removeKehu(kehuId)).then(() => {
          expect(ApiUtil.del).toBeCalledWith(`/kehut/${kehuId}`);
          expect(ApiUtil.get).toBeCalledWith("/profiili/feed");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when removing fails", (done) => {
        const kehuId = 1;
        const error = new Error("network error");
        ApiUtil.del = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: REMOVE_KEHU },
          { type: REMOVE_KEHU_ERROR, payload: error },
        ];

        store.dispatch(removeKehu(kehuId)).then(() => {
          expect(ApiUtil.del).toBeCalledWith(`/kehut/${kehuId}`);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe("sendKehu", () => {
      it("when sending succeeds", (done) => {
        const data = { form: 1 };
        const response = { response: 1 };

        ApiUtil.post = jest.fn(() => new Promise((res) => res(response)));
        ApiUtil.get = jest.fn(() => new Promise((res) => res(response)));

        // sendKehu function requires full state
        const state = { kehu: { ...initialState } };
        const store = mockStore(state);
        const expectedActions = [
          { type: SEND_KEHU },
          { type: SEND_KEHU_SUCCESS, payload: response },
          {
            type: RESET_REPORTS,
            payload: {
              kehus: state.kehu.kehus,
              // Note: redux-mock-store does not update the Redux store so
              // sent_kehus is still equal to original state value
              sent_kehus: state.kehu.sentKehus,
            },
          },
          { type: FEED_LOADED, payload: response },
        ];

        store.dispatch(sendKehu(data)).then(() => {
          expect(ApiUtil.post).toBeCalledWith("/kehut/laheta", data);
          expect(ApiUtil.get).toBeCalledWith("/profiili/feed");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when sending fails", (done) => {
        const data = { form: 1 };
        const error = new Error("network error");
        ApiUtil.post = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: SEND_KEHU },
          { type: SEND_KEHU_ERROR, payload: error },
        ];

        store.dispatch(sendKehu(data)).then(() => {
          expect(ApiUtil.post).toBeCalledWith("/kehut/laheta", data);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe("claimKehu", () => {
      it("when claiming succeeds", (done) => {
        const id = "132-405";
        const response = { response: 1 };

        ApiUtil.get = jest.fn(() => new Promise((res) => res(response)));

        const state = { kehu: { ...initialState } };
        const store = mockStore(state);
        const expectedActions = [
          { type: CLAIM_KEHU },
          { type: CLAIM_KEHU_SUCCESS, payload: response },
          { type: RESET_REPORTS, payload: { kehus: state.kehu.kehus } },
          { type: FEED_LOADED, payload: response },
        ];

        store.dispatch(claimKehu(id)).then(() => {
          expect(ApiUtil.get).nthCalledWith(1, `/kehut/lisaa/${id}`);
          //expect(ApiUtil.get).nthCalledWith(2, "/profiili/feed");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when claiming fails", (done) => {
        const id = "132-405";
        const error = new Error("network error");
        ApiUtil.get = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: CLAIM_KEHU },
          { type: CLAIM_KEHU_ERROR, payload: error },
        ];

        store.dispatch(claimKehu(id)).then(() => {
          expect(ApiUtil.get).toBeCalledWith(`/kehut/lisaa/${id}`);
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });

    describe("resetKehuFormState", () => {
      it("returns correct action", () => {
        expect(resetKehuFormState()).toEqual({ type: RESET_KEHU_FORM });
      });
    });

    describe("getKehus", () => {
      it("when fetching succeeds", (done) => {
        const response = [{ id: 1 }, { id: 2 }];
        ApiUtil.get = jest.fn(() => new Promise((res) => res(response)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: GET_KEHUS },
          { type: GET_KEHUS_SUCCESS, payload: response },
        ];

        store.dispatch(getKehus()).then(() => {
          expect(ApiUtil.get).toBeCalledWith("/kehut");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });

      it("when fetching fails", (done) => {
        const error = new Error("network error");
        ApiUtil.get = jest.fn(() => new Promise((res, rej) => rej(error)));

        const store = mockStore(initialState);
        const expectedActions = [
          { type: GET_KEHUS },
          { type: GET_KEHUS_ERROR, payload: error },
        ];

        store.dispatch(getKehus()).then(() => {
          expect(ApiUtil.get).toBeCalledWith("/kehut");
          expect(store.getActions()).toEqual(expectedActions);
          done();
        });
      });
    });
  });

  afterEach(() => {
    fetch.resetMocks();
  });
});
