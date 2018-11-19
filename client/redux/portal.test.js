import reducer, {
  TOGGLE_ADD_KEHU_MODAL,
  initialState,
  toggleAddKehuModal,
  OPEN_EDIT_KEHU_MODAL,
  openEditKehuModal
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

    it("on OPEN_EDIT_KEHU_MODAL", () => {
      const kehu = { id: 1 };
      const state = initialState;
      const action = { type: OPEN_EDIT_KEHU_MODAL, payload: kehu };
      const expectedState = { ...initialState, portalVisible: true, kehu };
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

    describe("openEditKehuModal", () => {
      it("returns correct action", () => {
        const kehu = { id: 1 };
        const expectedType = { type: OPEN_EDIT_KEHU_MODAL, payload: kehu };
        expect(openEditKehuModal(kehu)).toEqual(expectedType);
      });
    });
  });
});
