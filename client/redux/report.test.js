import { ADD_KEHU_SUCCESS, GET_KEHUS_SUCCESS } from "./kehu";
import reducer, { initialState, RESET_REPORTS } from "./report";

describe("client:redux:report", () => {
  const kehus = [
    { role: { role: "Esimies" } },
    { role: { role: "Asiakas" } },
    { role: { role: "Asiakas" } },
    { role: { role: "Kollega" } }
  ];

  describe("reducer", () => {
    it("on GET_KEHUS_SUCCESS", () => {
      const state = initialState;
      const action = { type: GET_KEHUS_SUCCESS, payload: kehus };
      const expectedState = {
        ...state,
        numberOfKehus: kehus.length,
        roles: [
          { role: "Asiakas", count: 2 },
          { role: "Esimies", count: 1 },
          { role: "Kollega", count: 1 }
        ]
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on ADD_KEHU_SUCCESS", () => {
      const state = {
        ...initialState,
        roles: [
          { role: "Asiakas", count: 2 },
          { role: "Esimies", count: 1 },
          { role: "Kollega", count: 1 }
        ]
      };
      const action = {
        type: ADD_KEHU_SUCCESS,
        payload: { kehu: { role: { role: "Asiakas" } } }
      };
      const expectedState = {
        ...state,
        numberOfKehus: state.numberOfKehus + 1,
        roles: [
          { role: "Asiakas", count: 3 },
          { role: "Esimies", count: 1 },
          { role: "Kollega", count: 1 }
        ]
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });

    it("on RESET_REPORTS", () => {
      const state = {
        ...initialState,
        numberOfKehus: 9,
        roles: [
          { role: "Alainen", count: 7 },
          { role: "Esimies", count: 1 },
          { role: "Muu", count: 4 }
        ]
      };
      const action = { type: RESET_REPORTS, payload: kehus };
      const expectedState = {
        ...state,
        numberOfKehus: kehus.length,
        roles: [
          { role: "Asiakas", count: 2 },
          { role: "Esimies", count: 1 },
          { role: "Kollega", count: 1 }
        ]
      };
      expect(reducer(state, action)).toEqual(expectedState);
    });
  });
});
