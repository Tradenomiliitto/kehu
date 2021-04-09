import { ImportanceSelectPanel } from "./ImportanceSelectPanel";

describe("client:components:kehuform:ImportanceSelectPanel", () => {
  let component;
  let handleClickStub;
  const value = 2;

  beforeEach(() => {
    handleClickStub = jest.fn();
    component = shallow(
      <ImportanceSelectPanel
        handleClick={handleClickStub}
        value={value}
        t={key => key}
      />
    );
  });

  it(`renders ${value} active stars`, () => {
    expect(component.find(".ImportanceSelector-star").length).toEqual(5);
    expect(component.find(".ImportanceSelector-star--active").length).toEqual(
      value
    );
  });

  describe("when star is clicked", () => {
    it("calls callback with star number", () => {
      component
        .find(".ImportanceSelector-star")
        .at(3)
        .simulate("click");
      expect(handleClickStub).toHaveBeenCalledWith(4);
    });
  });

  describe("when star is hovered", () => {
    beforeEach(() => {
      component
        .find(".ImportanceSelector-star")
        .at(3)
        .simulate("mouseOver");
    });

    it("sets all stars before active", () => {
      expect(component.find(".ImportanceSelector-star--active").length).toEqual(
        4
      );
    });

    describe("when star is not hovered any more", () => {
      beforeEach(() => {
        component
          .find(".ImportanceSelector-star")
          .at(3)
          .simulate("mouseOut");
      });

      it(`renders ${value} active stars`, () => {
        expect(component.find(".ImportanceSelector-star").length).toEqual(5);
        expect(
          component.find(".ImportanceSelector-star--active").length
        ).toEqual(value);
      });
    });
  });
});
