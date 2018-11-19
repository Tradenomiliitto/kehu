export const TOGGLE_ADD_KEHU_MODAL = "portal/TOGGLE_ADD_KEHU_MODAL";

export const initialState = {
  portalVisible: false
};

export function toggleAddKehuModal() {
  return { type: TOGGLE_ADD_KEHU_MODAL };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_ADD_KEHU_MODAL:
      return {
        ...state,
        portalVisible: !state.portalVisible
      };
    default:
      return state;
  }
}
