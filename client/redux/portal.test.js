import reducer, {
  TOGGLE_ADD_KEHU_FORM_MODAL,
  initialState,
  toggleAddKehuFormModal,
  OPEN_EDIT_KEHU_MODAL,
  openEditKehuModal,
  TOGGLE_SEND_KEHU_FORM_MODAL,
} from "./portal";
import { RESET_KEHU_FORM } from "./kehu";

describe("client:redux:portal", () => {
  describe("reducer", () => {
    it("has initial state", () => {
      expect(reducer()).toEqual(initialState);
    });

    it("on TOGGLE_ADD_KEHU_FORM_MODAL", () => {
      const state = initialState;
      const action = { type: TOGGLE_ADD_KEHU_FORM_MODAL };
      const expectedState = { ...initialState, addKehuPortalVisible: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on TOGGLE_SEND_KEHU_FORM_MODAL", () => {
      const state = initialState;
      const action = { type: TOGGLE_SEND_KEHU_FORM_MODAL };
      const expectedState = { ...initialState, sendKehuPortalVisible: true };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on OPEN_EDIT_KEHU_MODAL", () => {
      const kehu = { id: 1 };
      const state = initialState;
      const action = { type: OPEN_EDIT_KEHU_MODAL, payload: kehu };
      const expectedState = {
        ...initialState,
        addKehuPortalVisible: true,
        kehu,
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on RESET_KEHU_FORM", () => {
      const state = {
        addKehuPortalVisible: true,
        sendKehuPortalVisible: true,
        kehu: { id: 1 },
      };
      const action = { type: RESET_KEHU_FORM };
      const expectedState = { ...initialState };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });

  describe("actions", () => {
    describe("toggleAddKehuFormModal", () => {
      it("returns correct action", () => {
        const expectedType = { type: TOGGLE_ADD_KEHU_FORM_MODAL };
        expect(toggleAddKehuFormModal()).toEqual(expectedType);
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
