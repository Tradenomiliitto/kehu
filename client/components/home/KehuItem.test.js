import { KehuItem } from "./KehuItem";
import moment from "moment";
import { capitalizeText } from "../../util/TextUtil";

describe("client:components:home:KehuItem", () => {
  let component;
  const roles = [
    { id: 1, role: "client", imageId: "client" },
    { id: 6, role: "client", imageId: "client" },
  ];
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

  beforeEach(() => {
    component = shallow(
      <KehuItem kehu={kehu} roles={roles} t={(key) => key} />
    );
  });

  it("renders date", () => {
    expect(component.find(".FeedItem-date").text()).toEqual(
      moment(kehu.date_given).format("D.M.YYYY")
    );
  });

  it("renders text", () => {
    expect(component.find(".FeedItem-text").text()).toEqual(kehu.text);
  });

  it("renders correct info", () => {
    const expectedInfo = kehu.giver_name;
    expect(
      component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
    ).toEqual(expectedInfo);
  });

  describe("when role is given", () => {
    it("renders correct info", () => {
      const role = { id: 1, role: "client", imageId: "client" };
      component.setProps({ kehu: { ...kehu, role } });
      const expectedInfo = `${kehu.giver_name}, ${role.role}`;
      expect(
        component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
      ).toEqual(expectedInfo);
    });
  });

  describe("when tags are given", () => {
    it("renders correct info", () => {
      const tags = [{ text: "client" }, { text: "customer" }];
      component.setProps({ kehu: { ...kehu, tags } });
      const expectedInfo = `${kehu.giver_name}`;
      expect(
        component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
      ).toEqual(expectedInfo);
    });
  });

  describe("when kehu is new", () => {
    it("show the new kehu badge", () => {
      component.setProps({ kehu: { ...kehu, isNewKehu: true } });
      expect(component.find(".new-kehu-ribbon").text()).toEqual(
        "home.feed.new-kehu-ribbon"
      );
    });
  });

  describe("when received kehu", () => {
    it("renders correct info and shows sender image", () => {
      component.setProps({ kehu: { ...kehu, receiver_email: "some@email" } });
      const expectedInfo = `${kehu.giver_name}`;
      expect(
        component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
      ).toEqual(expectedInfo);
      expect(component.find(".FeedItem-image").prop("src")).toEqual(
        kehu.giver.picture
      );
    });
  });

  describe("when all info at once", () => {
    it("renders correct info", () => {
      const role = { id: 1, role: "client", imageId: "client" };
      const tags = [{ text: "client" }, { text: "customer" }];
      component.setProps({
        kehu: { ...kehu, tags, role, receiver_email: "some@email" },
      });
      const expectedInfo = `${kehu.giver_name}, ${role.role}`;
      expect(
        component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
      ).toEqual(expectedInfo);
      expect(component.find(".new-kehu-ribbon").exists()).toBeFalsy();
    });
  });

  describe("when user had saved the kehu role in added kehu", () => {
    it("renders image", () => {
      const role = { id: 6, role: "client", imageId: "client" };
      const src = `/images/role-client.svg`;
      component.setProps({
        kehu: { ...kehu, picture: null, role, type: "added" },
      });
      expect(component.find(".FeedItem-image").prop("src")).toEqual(src);
    });
  });

  describe("when kehu has no picture or role", () => {
    it("does not render image", () => {
      component.setProps({ kehu: { ...kehu, type: "added" } });
      expect(component.find(".FeedItem-image").exists()).toBeFalsy();
    });
  });
});
