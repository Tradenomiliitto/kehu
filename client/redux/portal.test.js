import reducer, {
  TOGGLE_ADD_KEHU_MODAL,
  initialState,
  toggleAddKehuModal
} from "./portal";

describe("client:redux:portal", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on TOGGLE_ADD_KEHU_MODAL", () => {
      const state = initialState;
      const action = { type: TOGGLE_ADD_KEHU_MODAL };
      const expectedState = { ...initialState, portalVisible: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("toggleAddKehuModal", () => {
      it("returns correct action", () => {
        const expectedType = { type: TOGGLE_ADD_KEHU_MODAL };
        expect(toggleAddKehuModal()).toEqual(expectedType);
      });
    });
  });
});
