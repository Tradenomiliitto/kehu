import { KehusPanel } from "./KehusPanel";

describe("client:components:KehusPanel", () => {
  let component;
  let getKehusStub;
  const error = {
    message: "Random error"
  };
  const roles = [];

  beforeEach(() => {
    getKehusStub = jest.fn();
  });

  describe("when kehus are not loaded", () => {
    beforeEach(() => {
      component = shallow(
        <KehusPanel
          kehus={[]}
          getKehus={getKehusStub}
          kehusLoaded={false}
          roles={roles}
        />
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
        <KehusPanel
          kehus={[]}
          getKehus={getKehusStub}
          kehusLoaded={true}
          roles={roles}
        />
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

    it("does not render ErrorPanel", () => {
      expect(component.find("ErrorPanel").exists()).toBeFalsy();
    });

    describe("when error happens", () => {
      beforeEach(() => {
        component.setProps({ error });
      });

      it("renders error panel", () => {
        expect(
          component
            .find("ErrorPanel")
            .first()
            .prop("message")
        ).toEqual(
          `Valitettavasti Kehun poistaminen epäonnistui. Seuraava virhe tapahtui: ${
            error.message
          }.`
        );
      });
    });
  });
});
