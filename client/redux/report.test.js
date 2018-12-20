import { GET_KEHUS_SUCCESS } from "./kehu";
import reducer, { initialState } from "./report";

describe("client:redux:report", () => {
  const kehus = [{}, {}, {}];

  describe("reducer", () => {
    describe("on GET_KEHUS_SUCCESS", () => {
      it("counts kehus", () => {
        const state = initialState;
        const action = { type: GET_KEHUS_SUCCESS, payload: kehus };
        const expectedState = { ...state, numberOfKehus: kehus.length };
        expect(reducer(state, action)).toEqual(expectedState);
      });
    });
  });
});
