import { App } from "./App";

describe("client:App", () => {
  let component;
  let getProfileStub;
  let getKehusStub;

  beforeEach(() => {
    getProfileStub = jest.fn();
    getKehusStub = jest.fn();
  });

  describe("by default", () => {
    beforeEach(() => {
      component = shallow(<App {...createProps(false, false)} />);
    });

    it("fetches profile", () => {
      expect(getProfileStub).toHaveBeenCalled();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when profile is loaded", () => {
    beforeEach(() => {
      component = shallow(<App {...createProps(true, false)} />);
    });

    it("does not fetch profile", () => {
      expect(getProfileStub).not.toHaveBeenCalled();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when kehus are loaded", () => {
    beforeEach(() => {
      component = shallow(<App {...createProps(false, true)} />);
    });

    it("fetches profile", () => {
      expect(getProfileStub).toHaveBeenCalled();
    });

    it("does not fetch kehus", () => {
      expect(getKehusStub).not.toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when profile and kehus are loaded", () => {
    beforeEach(() => {
      component = shallow(<App {...createProps(true, true)} />);
    });

    it("does not fetch profile", () => {
      expect(getProfileStub).not.toHaveBeenCalled();
    });

    it("does not fetch kehus", () => {
      expect(getKehusStub).not.toHaveBeenCalled();
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

  function createProps(profileLoaded, kehusLoaded) {
    return {
      isAddKehuPortalVisible: false,
      isSendKehuPortalVisible: false,
      profileLoaded,
      kehusLoaded,
      getProfile: getProfileStub,
      getKehus: getKehusStub,
      tReady: true,
      t: key => key,
      i18n: {}
    };
  }
});
