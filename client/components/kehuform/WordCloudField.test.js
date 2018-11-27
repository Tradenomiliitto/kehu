import WordCloudField from "./WordCloudField";

describe("client:components:kehuform:WordCloudField", () => {
  let component;
  let handleChangeStub;
  const className = "ClassName";
  const id = "component-id";
  const label = "component label";
  const placeholder = "placeholder";
  const value1 = "value1";
  const value2 = "value2";
  const value3 = "value3";
  const initValues = [];
  const fullValues = [value1, value2];
  const cloudItems = [{ text: "text" }];

  beforeEach(() => {
    handleChangeStub = jest.fn();
    component = shallow(
      <WordCloudField
        className={className}
        cloudItems={cloudItems}
        handleChange={handleChangeStub}
        id={id}
        label={label}
        placeholder={placeholder}
        values={initValues}
      />
    );
  });

  it("renders label", () => {
    expect(component.find(".label-js").text()).toEqual(label);
  });

  it("renders input field", () => {
    expect(component.find(".input-js").props()).toMatchObject({
      className: `WordCloudField ${className}Field input-js`,
      id,
      name: id,
      placeholder
    });
  });

  it("does not render items", () => {
    expect(component.find(".item-js").exists()).toBeFalsy();
  });

  describe("when input field changes", () => {
    beforeEach(() => {
      component
        .find(".input-js")
        .simulate("change", { target: { value: value1 } });
    });

    it("updates input value", () => {
      changeInputValue(value1);
    });

    describe("when add button is clicked", () => {
      beforeEach(() => {
        addValue();
      });

      it("updates input value", () => {
        expect(component.find(".input-js").prop("value")).toEqual("");
      });

      it("calls handleChange callback", () => {
        expect(handleChangeStub).toBeCalledWith([value1]);
      });
    });
  });

  describe("when element has values", () => {
    beforeEach(() => {
      component.setProps({ values: fullValues });
    });

    it("renders items", () => {
      expect(component.find(".item-js").length).toEqual(fullValues.length);
    });

    describe("when adding new value", () => {
      it("adds new value to item list and calls handleChange callback", () => {
        changeInputValue(value3);
        addValue();
        expect(handleChangeStub).toBeCalledWith([...fullValues, value3]);
      });
    });

    describe("when trying to add same value", () => {
      it("does not add duplicate value", () => {
        changeInputValue(value1);
        addValue();
        expect(handleChangeStub).toBeCalledWith(fullValues);
      });
    });

    describe("when removing item", () => {
      it("removes item from list and calls handleChange callback", () => {
        component
          .find(".item-js button")
          .first()
          .simulate("click", { preventDefault: () => {} });
        expect(handleChangeStub).toBeCalledWith([fullValues[1]]);
      });
    });
  });

  function changeInputValue(value) {
    component.find(".input-js").simulate("change", { target: { value } });
  }

  function addValue() {
    component.find(".add-js").simulate("click", { preventDefault: () => {} });
  }
});
