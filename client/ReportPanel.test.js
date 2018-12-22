import { ReportPanel } from "./ReportPanel";

describe("client:components:ReportPanel", () => {
  let component;
  let getKehusStub;

  beforeEach(() => {
    getKehusStub = jest.fn();
  });

  describe("when kehus are not loaded", () => {
    beforeEach(() => {
      component = shallow(
        <ReportPanel
          getKehus={getKehusStub}
          kehusLoaded={false}
          report={{ numberOfKehus: 0, roles: [] }}
        />
      );
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
    });

    it("does not render ReportPanel", () => {
      expect(component.find(".ReportPanel").exists()).toBeFalsy();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });
  });

  describe("when kehus are loaded", () => {
    beforeEach(() => {
      component = shallow(
        <ReportPanel
          getKehus={getKehusStub}
          kehusLoaded={true}
          report={{ numberOfKehus: 5, roles: [] }}
        />
      );
    });

    it("does not render Spinner", () => {
      expect(component.find("Spinner").exists()).toBeFalsy();
    });

    it("renders ReportPanel", () => {
      expect(component.find(".ReportPanel").exists()).toBeTruthy();
    });

    it("does not fetch kehus", () => {
      expect(getKehusStub).not.toHaveBeenCalled();
    });
  });
});
