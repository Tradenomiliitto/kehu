import KehusTableActionButton from "./KehusTableActionButton";

describe("client:components:kehus:KehusTableActionButton", () => {
  let component;
  let onClickStub;

  beforeEach(() => {
    onClickStub = jest.fn();
    component = shallow(
      <KehusTableActionButton icon={"icon"} onClick={onClickStub} />,
    );
  });

  it("handles click", () => {
    component.simulate("click");
    expect(onClickStub).toHaveBeenCalled();
  });
});
