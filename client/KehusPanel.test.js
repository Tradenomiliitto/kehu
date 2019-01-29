import { KehusPanel } from "./KehusPanel";

describe("client:components:KehusPanel", () => {
  let component;
  const error = {
    message: "Random error"
  };
  const roles = [];

  beforeEach(() => {
    component = shallow(<KehusPanel kehus={[]} roles={roles} />);
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
