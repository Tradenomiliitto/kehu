import { HomePanel } from "./HomePanel";

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
      expect(component.find(".Welcome").exists()).toBeTruthy();
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
      expect(component.find(".Welcome").exists()).toBeFalsy();
    });
  });

  function createProps(search) {
    return {
      history: {
        location: {
          search
        },
        replace: replaceStub
      },
      hasKehus: false,
      tags: [{ text: "Test" }, { text: "Tag" }],
      toggleAddKehuFormModal: toggleAddKehuFormModalStub,
      toggleSendKehuFormModal: toggleSendKehuFormModalStub
    };
  }
});
