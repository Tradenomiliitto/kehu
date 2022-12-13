import { HomePanel } from "./HomePanel";
import FeedPanel from "./components/home/FeedPanel";
import WelcomePanel from "./components/home/WelcomePanel";

describe("client:Homepanel", () => {
  let component;
  let toggleAddKehuFormModalStub;
  let toggleSendKehuFormModalStub;
  let replaceStub;

  beforeEach(() => {
    replaceStub = jest.fn();
    toggleAddKehuFormModalStub = jest.fn();
    toggleSendKehuFormModalStub = jest.fn();
  });

  describe("by default", () => {
    beforeEach(() => {
      const props = createProps("");
      component = shallow(<HomePanel {...props} />);
    });

    it("does not open any modal", () => {
      expect(toggleAddKehuFormModalStub).not.toHaveBeenCalled();
      expect(toggleSendKehuFormModalStub).not.toHaveBeenCalled();
    });

    it("does not replace location", () => {
      expect(replaceStub).not.toHaveBeenCalled();
    });

    it("renders Welcome element", () => {
      expect(component.find(WelcomePanel).exists()).toBeTruthy();
    });

    it("noes not render FeedPanel", () => {
      expect(component.find(FeedPanel).exists()).toBeFalsy();
    });
  });

  describe('when "lisaa" query param is given', () => {
    beforeEach(() => {
      const props = createProps("?q=lisaa");
      component = shallow(<HomePanel {...props} />);
    });

    it("opens add kehu form modal", () => {
      expect(toggleAddKehuFormModalStub).toHaveBeenCalled();
      expect(toggleSendKehuFormModalStub).not.toHaveBeenCalled();
    });

    it("removes the query param", () => {
      expect(replaceStub).toHaveBeenCalledWith("/");
    });
  });

  describe('when "laheta" query param is given', () => {
    beforeEach(() => {
      const props = createProps("?q=laheta");
      component = shallow(<HomePanel {...props} />);
    });

    it("opens send kehu form modal", () => {
      expect(toggleAddKehuFormModalStub).not.toHaveBeenCalled();
      expect(toggleSendKehuFormModalStub).toHaveBeenCalled();
    });

    it("removes the query param", () => {
      expect(replaceStub).toHaveBeenCalledWith("/");
    });
  });

  describe("when user has Kehus", () => {
    it("does not render Welcome element", () => {
      component.setProps({ hasKehus: true });
      expect(component.find(WelcomePanel).exists()).toBeFalsy();
      expect(component.find(FeedPanel).exists()).toBeTruthy();
    });
  });

  function createProps(search) {
    const kehu = {
      type: "received",
      id: 1,
      date_given: "2019-02-10",
      text: "text",
      giver_id: 1,
      giver_name: "name",
      giver: {
        picture: "pic-src",
      },
      is_public: false,
      situations: [],
      tags: [],
    };

    const sentKehu = {
      type: "sent",
      id: 1,
      date_given: "2019-02-10",
      giver_id: 1,
      giver_name: "name",
      receiver_name: "receiver name",
      text: "text",
      giver: {
        picture: "/images/picture.svg",
      },
      situations: [],
      tags: [],
    };

    return {
      history: {
        location: {
          search,
        },
        replace: replaceStub,
      },
      feedItems: [kehu, sentKehu],
      hasKehus: false,
      tags: [{ text: "Test" }, { text: "Tag" }],
      toggleAddKehuFormModal: toggleAddKehuFormModalStub,
      toggleSendKehuFormModal: toggleSendKehuFormModalStub,
      t: (key) => key,
      i18n: {},
    };
  }
});
