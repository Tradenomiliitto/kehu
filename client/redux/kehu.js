export const ADD_KEHU = "kehu/ADD_KEHU";
export const ADD_KEHU_SUCCESS = "kehu/ADD_KEHU_SUCCESS";
export const ADD_KEHU_ERROR = "kehu/ADD_KEHU_ERROR";

export const initialState = {
  error: null,
  loading: false,
  kehus: []
};

export function addKehu(data) {
  return async dispatch => {
    try {
      dispatch({ type: ADD_KEHU });
      const response = await fetch("/api/v1/kehu", {
        method: "POST",
        body: data
      });
      const kehu = await response.json();
      dispatch({ type: ADD_KEHU_SUCCESS, payload: kehu });
    } catch (e) {
      dispatch({ type: ADD_KEHU_ERROR, payload: e });
    }
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_KEHU:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_KEHU_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        kehus: [action.payload]
      };
    case ADD_KEHU_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}
