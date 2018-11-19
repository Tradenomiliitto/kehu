import { KehuRow } from "./KehuRow";

describe("client:components:kehus:KehuRow", () => {
  let component;
  let removeKehuStub;
  const kehu = { id: 1, tags: [], situations: [] };

  beforeEach(() => {
    removeKehuStub = jest.fn();
    component = shallow(<KehuRow kehu={kehu} removeKehu={removeKehuStub} />);
  });

  describe("when remove button is clicked", () => {
    describe("when action is confirmed", () => {
      beforeEach(() => {
        global.confirm = jest.fn(() => true);
        component
          .find("KehusTableActionButton")
          .at(1)
          .simulate("click");
      });

      it("confirms action", () => {
        expect(global.confirm).toHaveBeenCalled();
      });

      it("removes kehu", () => {
        expect(removeKehuStub).toHaveBeenCalledWith(kehu.id);
      });
    });

    describe("when action is declined", () => {
      beforeEach(() => {
        global.confirm = jest.fn(() => false);
        component
          .find("KehusTableActionButton")
          .at(1)
          .simulate("click");
      });

      it("confirms action", () => {
        expect(global.confirm).toHaveBeenCalled();
      });

      it("does not remove kehu", () => {
        expect(removeKehuStub).not.toHaveBeenCalled();
      });
    });
  });
});
