export const TOGGLE_KEHU_FORM_MODAL = "portal/TOGGLE_KEHU_FORM_MODAL";
export const OPEN_EDIT_KEHU_MODAL = "portal/OPEN_EDIT_KEHU_MODAL";

export const initialState = {
  portalVisible: false,
  kehu: undefined
};

export function toggleKehuFormModal() {
  return { type: TOGGLE_KEHU_FORM_MODAL };
}

export function openEditKehuModal(kehu) {
  return { type: OPEN_EDIT_KEHU_MODAL, payload: kehu };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_KEHU_FORM_MODAL:
      return {
        ...state,
        portalVisible: !state.portalVisible
      };
    case OPEN_EDIT_KEHU_MODAL:
      return {
        ...state,
        portalVisible: true,
        kehu: action.payload
      };
    default:
      return state;
  }
}
