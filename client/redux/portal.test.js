import reducer, { TOGGLE_MODAL, initialState, toggleModal } from "./portal";

describe("client:redux:portal", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on TOGGLE_MODAL", () => {
      const state = initialState;
      const action = { type: TOGGLE_MODAL };
      const expectedState = { ...initialState, isVisible: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("toggleModal", () => {
      it("returns correct action", () => {
        const expectedType = { type: TOGGLE_MODAL };
        expect(toggleModal()).toEqual(expectedType);
      });
    });
  });
});
