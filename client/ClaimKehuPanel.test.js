import { ClaimKehuPanel } from "./ClaimKehuPanel";

describe("client:ClaimKehuPanel", () => {
  const claim_id = "1432-2353";
  const match = {
    params: { claim_id }
  };
  let component;
  let claimKehuStub;

  beforeEach(() => {
    claimKehuStub = jest.fn();
    component = shallow(
      <ClaimKehuPanel
        isKehuClaimed={false}
        claimKehu={claimKehuStub}
        match={match}
        t={key => key}
      />
    );
  });

  it("renders Spinner", () => {
    expect(component.find("Spinner").exists()).toBeTruthy();
  });

  it("claims Kehu", () => {
    expect(claimKehuStub).toHaveBeenCalledWith(claim_id);
  });

  describe("when Kehu has been claimed", () => {
    beforeEach(() => {
      component.setProps({ isKehuClaimed: true });
    });

    it("does not render Spinner", () => {
      expect(component.find("Spinner").exists()).toBeFalsy();
    });

    it("renders success message", () => {
      expect(component.find(".success-js").exists()).toBeTruthy();
    });
  });

  describe("when error happnes", () => {
    beforeEach(() => {
      component.setProps({ error: { error: "message" } });
    });

    it("does not render Spinner", () => {
      expect(component.find("Spinner").exists()).toBeFalsy();
    });

    it("renders ErrorPanel", () => {
      expect(component.find("ErrorPanel").exists()).toBeTruthy();
    });
  });
});
