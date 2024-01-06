import { KehusPanel } from "./KehusPanel";

describe("client:components:KehusPanel", () => {
  let component;
  const error = {
    message: "Random error",
  };
  const roles = [];

  beforeEach(() => {
    component = shallow(
      <KehusPanel
        kehus={[]}
        sentKehus={[]}
        history={{ push: () => {} }}
        roles={roles}
        t={(key) => key}
        i18n={{}}
        location={{ search: "" }}
      />,
    );
  });

  it("does not render ErrorPanel", () => {
    expect(component.find("ErrorPanel").exists()).toBeFalsy();
  });

  describe("when error happens", () => {
    beforeEach(() => {
      component.setProps({ error });
    });

    it("renders error panel", () => {
      expect(component.find("ErrorPanel").first().prop("message")).toEqual(
        `kehus.remove-kehu-error`,
      );
    });
  });
});
