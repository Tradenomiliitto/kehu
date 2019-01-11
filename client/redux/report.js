import { ADD_KEHU_SUCCESS, GET_KEHUS_SUCCESS } from "./kehu";

export const RESET_REPORTS = "report/RESET_REPORTS";

export const initialState = {
  numberOfKehus: 0,
  roles: [],
  situations: [],
  tags: []
};

function sortItems(a, b) {
  if (a.count < b.count) {
    return 1;
  } else if (a.count > b.count) {
    return -1;
  } else {
    return 0;
  }
}

function reduceItems(property, acc, kehu) {
  if (kehu[property]) {
    kehu[property].forEach(item => {
      const index = acc.findIndex(it => it.text === item.text);
      if (index === -1) {
        acc.push({ text: item.text, count: 1 });
      } else {
        acc[index].count = acc[index].count + 1;
      }
    });
  }
  return acc;
}

function countRoles(kehus) {
  return kehus
    .reduce((acc, kehu) => {
      const index = kehu.role
        ? acc.findIndex(it => it.role === kehu.role.role)
        : -1;
      if (index === -1 && kehu.role) {
        acc.push({ role: kehu.role.role, count: 1 });
      } else if (kehu.role) {
        acc[index].count = acc[index].count + 1;
      }
      return acc;
    }, [])
    .sort(sortItems);
}

function countTags(kehus) {
  return kehus.reduce(reduceItems.bind(null, "tags"), []).sort(sortItems);
}

function countSituations(kehus) {
  return kehus.reduce(reduceItems.bind(null, "situations"), []).sort(sortItems);
}

function addToRoles(roles, kehu) {
  const index = kehu.role
    ? roles.findIndex(role => role.role === kehu.role.role)
    : -1;
  if (index === -1 && kehu.role) {
    roles.push({ role: kehu.role.role, count: 1 });
  } else if (kehu.role) {
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
        numberOfKehus: action.payload.kehus.length,
        roles: countRoles(action.payload.kehus),
        tags: countTags(action.payload.kehus),
        situations: countSituations(action.payload.kehus)
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
