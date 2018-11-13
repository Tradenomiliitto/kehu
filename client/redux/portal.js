const TOGGLE_MODAL = "portal/TOGGLE_MODAL";

const initialState = {
  isVisible: false
};

export function toggleModal() {
  return { type: TOGGLE_MODAL };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_MODAL:
      return {
        ...state,
        isVisible: !state.isVisible
      };
    default:
      return state;
  }
}
