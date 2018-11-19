export const TOGGLE_ADD_KEHU_MODAL = "portal/TOGGLE_ADD_KEHU_MODAL";
export const OPEN_EDIT_KEHU_MODAL = "portal/OPEN_EDIT_KEHU_MODAL";

export const initialState = {
  portalVisible: false,
  kehu: undefined
};

export function toggleAddKehuModal() {
  return { type: TOGGLE_ADD_KEHU_MODAL };
}

export function openEditKehuModal(kehu) {
  return { type: OPEN_EDIT_KEHU_MODAL, payload: kehu };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_ADD_KEHU_MODAL:
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
