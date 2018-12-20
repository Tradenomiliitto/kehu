import { GET_KEHUS_SUCCESS } from "./kehu";

export const initialState = {
  numberOfKehus: 0
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_KEHUS_SUCCESS:
      return {
        ...state,
        numberOfKehus: action.payload.length
      };

    default:
      return state;
  }
}
