import { KehuFormModal } from "./KehuFormModal";

describe("client:components:KehuFormModal", () => {
  let component;
  let toggleModalStub;
  let resetAddKehuStateStub;
  const title = "Form Title";
  const childComponent = "<div>children</div>";

  beforeEach(() => {
    toggleModalStub = jest.fn();
    resetAddKehuStateStub = jest.fn();
    component = shallow(
      <KehuFormModal
        title={title}
        toggleModal={toggleModalStub}
        resetAddKehuState={resetAddKehuStateStub}
      >
        {childComponent}
      </KehuFormModal>
    );
  });

  it("renders title", () => {
    expect(component.find(".modal-title-js").text()).toEqual(title);
  });

  it("renders children", () => {
    expect(component.children().contains(childComponent)).toEqual(true);
  });

  describe("when toggle button is clicked", () => {
    beforeEach(() => {
      component.find(".close-button-js").simulate("click");
    });

    it("resets add kehu state", () => {
      expect(resetAddKehuStateStub).toBeCalled();
    });
  });
});
