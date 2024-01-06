import { App } from "./App";

describe("client:App", () => {
  let component;
  let getProfileStub;
  let getKehusStub;
  let getGroupsStub;

  beforeEach(() => {
    getProfileStub = jest.fn();
    getKehusStub = jest.fn();
    getGroupsStub = jest.fn();
  });

  describe("by default", () => {
    beforeEach(() => {
      component = shallow(
        <App
          {...createProps({
            profileLoaded: false,
            kehusLoaded: false,
            groupsLoaded: false,
          })}
        />,
      );
    });

    it("fetches profile", () => {
      expect(getProfileStub).toHaveBeenCalled();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });

    it("fetches groups", () => {
      expect(getGroupsStub).toHaveBeenCalled();
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
          {...createProps({
            profileLoaded: true,
            kehusLoaded: false,
            groupsLoaded: false,
          })}
        />,
      );
    });

    it("does not fetch profile", () => {
      expect(getProfileStub).not.toHaveBeenCalled();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });

    it("fetches groups", () => {
      expect(getGroupsStub).toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when kehus are loaded", () => {
    beforeEach(() => {
      component = shallow(
        <App
          {...createProps({
            profileLoaded: false,
            kehusLoaded: true,
            groupsLoaded: false,
          })}
        />,
      );
    });

    it("fetches profile", () => {
      expect(getProfileStub).toHaveBeenCalled();
    });

    it("does not fetch kehus", () => {
      expect(getKehusStub).not.toHaveBeenCalled();
    });

    it("fetches groups", () => {
      expect(getGroupsStub).toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when groups are loaded", () => {
    beforeEach(() => {
      component = shallow(
        <App
          {...createProps({
            profileLoaded: false,
            kehusLoaded: false,
            groupsLoaded: true,
          })}
        />,
      );
    });

    it("fetches profile", () => {
      expect(getProfileStub).toHaveBeenCalled();
    });

    it("fetches kehus", () => {
      expect(getKehusStub).toHaveBeenCalled();
    });

    it("does not fetch groups", () => {
      expect(getGroupsStub).not.toHaveBeenCalled();
    });

    it("renders Spinner", () => {
      expect(component.find("Spinner").exists()).toBeTruthy();
      expect(component.find(".App").exists()).toBeFalsy();
    });
  });

  describe("when profile, kehus and groups are loaded", () => {
    beforeEach(() => {
      component = shallow(
        <App
          {...createProps({
            profileLoaded: true,
            kehusLoaded: true,
            groupsLoaded: true,
          })}
        />,
      );
    });

    it("does not fetch profile", () => {
      expect(getProfileStub).not.toHaveBeenCalled();
    });

    it("does not fetch kehus", () => {
      expect(getKehusStub).not.toHaveBeenCalled();
    });

    it("does not fetch groups", () => {
      expect(getGroupsStub).not.toHaveBeenCalled();
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

  function createProps({ profileLoaded, kehusLoaded, groupsLoaded }) {
    return {
      isAddKehuPortalVisible: false,
      isSendKehuPortalVisible: false,
      profileLoaded,
      kehusLoaded,
      groupsLoading: false,
      groupsLoaded,
      getProfile: getProfileStub,
      getKehus: getKehusStub,
      getGroups: getGroupsStub,
      tReady: true,
      t: (key) => key,
      i18n: {},
    };
  }
});
