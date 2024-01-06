import { KehuRow } from "./KehuRow";
import { truncateText } from "../../util/TextUtil";

describe("client:components:kehus:KehuRow", () => {
  let component;
  let removeKehuStub;
  let openEditKehuModalStub;
  let stopPropagationStub;
  const kehu = {
    id: 1,
    tags: [],
    situations: [],
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  };

  beforeEach(() => {
    removeKehuStub = jest.fn();
    openEditKehuModalStub = jest.fn();
    stopPropagationStub = jest.fn();
    component = shallow(
      <KehuRow
        kehu={kehu}
        removeKehu={removeKehuStub}
        openEditKehuModal={openEditKehuModalStub}
        t={(key) => key}
      />,
    );
  });

  it("is closed by default", () => {
    expect(component.state().open).toBeFalsy();
    expect(component.find(".KehusTable-cell--tagsOpen").exists()).toBeFalsy();
    expect(component.find(".text-js").text()).toEqual(
      truncateText(kehu.text, 200),
    );
  });

  describe("when row is clicked", () => {
    beforeEach(() => {
      component.simulate("click");
    });

    it("opens the row", () => {
      expect(component.state().open).toBeTruthy();
      expect(
        component.find(".KehusTable-cell--tagsOpen").exists(),
      ).toBeTruthy();
      expect(component.find(".text-js").text()).toEqual(kehu.text);
    });
  });

  describe("when edit button is clicked", () => {
    beforeEach(() => {
      component
        .find("KehusTableActionButton")
        .first()
        .simulate("click", { stopPropagation: stopPropagationStub });
    });

    it("stops event propagation", () => {
      expect(stopPropagationStub).toHaveBeenCalled();
    });

    it("edits kehu", () => {
      expect(openEditKehuModalStub).toHaveBeenCalledWith(kehu);
    });
  });

  describe("when remove button is clicked", () => {
    describe("when action is confirmed", () => {
      beforeEach(() => {
        global.confirm = jest.fn(() => true);
        component
          .find("KehusTableActionButton")
          .at(1)
          .simulate("click", { stopPropagation: stopPropagationStub });
      });

      it("stops event propagation", () => {
        expect(stopPropagationStub).toHaveBeenCalled();
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
          .simulate("click", { stopPropagation: stopPropagationStub });
      });

      it("stops event propagation", () => {
        expect(stopPropagationStub).toHaveBeenCalled();
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
