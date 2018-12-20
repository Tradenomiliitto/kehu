import { GET_KEHUS_SUCCESS } from "./kehu";
import reducer, { initialState } from "./report";

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
  });
});
