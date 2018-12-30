import { App } from "./App";

describe("client:App", () => {
  let component;
  let getProfileStub;

  describe("by default", () => {
    beforeEach(() => {
      getProfileStub = jest.fn();
      component = shallow(
        <App
          isAddKehuPortalVisible={false}
          isSendKehuPortalVisible={false}
          profileLoaded={false}
          getProfile={getProfileStub}
        />
      );
    });

    it("fetches profile", () => {
      expect(getProfileStub).toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when profile is loaded", () => {
    beforeEach(() => {
      component = shallow(
        <App
          isAddKehuPortalVisible={false}
          isSendKehuPortalVisible={false}
          profileLoaded={true}
          getProfile={getProfileStub}
        />
      );
    });

    it("does not fetch profile", () => {
      expect(getProfileStub).not.toHaveBeenCalled();
    });

    it("renders App", () => {
      expect(component.find(".App").exists()).toBeTruthy();
      expect(component.find("Spinner").exists()).toBeFalsy();
    });

    it("does not render Portal", () => {
      expect(component.find("Portal").exists()).toBeFalsy();
    });

    describe("when adding kehu", () => {
      beforeEach(() => {
        component.setProps({ isAddKehuPortalVisible: true });
      });

      it("renders Portal", () => {
        expect(component.find("Portal").exists()).toBeTruthy();
      });
    });

    describe("when sending kehu", () => {
      beforeEach(() => {
        component.setProps({ isSendKehuPortalVisible: true });
      });

      it("renders Portal", () => {
        expect(component.find("Portal").exists()).toBeTruthy();
      });
    });
  });

  afterEach(() => {
    getProfileStub.mockClear();
  });
});
