import { RESET_KEHU_FORM } from "./kehu";

export const TOGGLE_ADD_KEHU_FORM_MODAL = "portal/TOGGLE_ADD_KEHU_FORM_MODAL";
export const TOGGLE_SEND_KEHU_FORM_MODAL = "portal/TOGGLE_SEND_KEHU_FORM_MODAL";
export const OPEN_EDIT_KEHU_MODAL = "portal/OPEN_EDIT_KEHU_MODAL";

export const initialState = {
  addKehuPortalVisible: false,
  sendKehuPortalVisible: false,
  kehu: null
};

export function toggleAddKehuFormModal() {
  return { type: TOGGLE_ADD_KEHU_FORM_MODAL };
}

export function toggleSendKehuFormModal() {
  return { type: TOGGLE_SEND_KEHU_FORM_MODAL };
}

export function openEditKehuModal(kehu) {
  return { type: OPEN_EDIT_KEHU_MODAL, payload: kehu };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_ADD_KEHU_FORM_MODAL:
      return {
        ...state,
        addKehuPortalVisible: !state.addKehuPortalVisible
      };
    case TOGGLE_SEND_KEHU_FORM_MODAL:
      return {
        ...state,
        sendKehuPortalVisible: !state.sendKehuPortalVisible
      };
    case OPEN_EDIT_KEHU_MODAL:
      return {
        ...state,
        addKehuPortalVisible: true,
        kehu: action.payload
      };
    case RESET_KEHU_FORM:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
