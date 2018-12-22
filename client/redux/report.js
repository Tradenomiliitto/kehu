import { ADD_KEHU_SUCCESS, GET_KEHUS_SUCCESS } from "./kehu";

export const RESET_REPORTS = "report/RESET_REPORTS";

export const initialState = {
  numberOfKehus: 0,
  roles: []
};

function countRoles(kehus) {
  return kehus
    .reduce((acc, kehu) => {
      const index = acc.findIndex(it => it.role === kehu.role.role);
      if (index === -1) {
        acc.push({ role: kehu.role.role, count: 1 });
      } else {
        acc[index].count = acc[index].count + 1;
      }
      return acc;
    }, [])
    .sort((a, b) => {
      if (a.count < b.count) {
        return 1;
      } else if (a.count > b.count) {
        return -1;
      } else {
        return 0;
      }
    });
}

function addToRoles(roles, kehu) {
  const index = roles.findIndex(role => role.role === kehu.role.role);
  if (index === -1) {
    roles.push({ role: kehu.role.role, count: 1 });
  } else {
    roles[index].count = roles[index].count + 1;
  }
  return roles;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case RESET_REPORTS:
    case GET_KEHUS_SUCCESS:
      return {
        ...state,
        numberOfKehus: action.payload.length,
        roles: countRoles(action.payload)
      };

    case ADD_KEHU_SUCCESS:
      return {
        ...state,
        numberOfKehus: state.numberOfKehus + 1,
        roles: addToRoles(state.roles, action.payload.kehu)
      };

    default:
      return state;
  }
}
