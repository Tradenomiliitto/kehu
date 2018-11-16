import { KehusPanel } from "./KehusPanel";

describe("client:components:KehusPanel", () => {
  let component;
  let getKehusStub;

  beforeEach(() => {
    getKehusStub = jest.fn();
  });

  describe("when kehus are not loaded", () => {
    beforeEach(() => {
      component = shallow(
        <KehusPanel kehus={[]} getKehus={getKehusStub} kehusLoaded={false} />
      );
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
    });

    it("does not render KehusPanel", () => {
      expect(component.find(".KehusPanel").exists()).toBeFalsy();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });
  });

  describe("when kehus are loaded", () => {
    beforeEach(() => {
      component = shallow(
        <KehusPanel kehus={[]} getKehus={getKehusStub} kehusLoaded={true} />
      );
    });

    it("does not render Spinner", () => {
      expect(component.find("Spinner").exists()).toBeFalsy();
    });

    it("renders KehusPanel", () => {
      expect(component.find(".KehusPanel").exists()).toBeTruthy();
    });

    it("does not fetch kehus", () => {
      expect(getKehusStub).not.toHaveBeenCalled();
    });
  });
});
