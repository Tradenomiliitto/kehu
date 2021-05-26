import { KehuItem } from "./KehuItem";
import moment from "moment";
import { capitalizeText } from "../../util/TextUtil";

describe("client:components:home:KehuItem", () => {
  let component;
  const roles = [
    { id: 1, role: "client", imageId: "client" },
    { id: 6, role: "client", imageId: "client" }
  ];
  const kehu = {
    date_given: "2019-02-10",
    text: "text",
    giver_name: "name",
    giver: {
      picture: "pic-src"
    }
  };

  beforeEach(() => {
    component = shallow(<KehuItem kehu={kehu} roles={roles} t={key => key} />);
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
    expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
  });

  describe("when role is given", () => {
    it("renders correct info", () => {
      const role = { id: 1, role: "client" };
      component.setProps({ kehu: { ...kehu, role } });
      const expectedInfo = `${kehu.giver_name}, ${role.role}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
    });
  });

  describe("when tags are given", () => {
    it("renders correct info", () => {
      const tags = [{ text: "client" }, { text: "customer" }];
      component.setProps({ kehu: { ...kehu, tags } });
      const expectedInfo = `${kehu.giver_name}. kehus.skills: ${capitalizeText(
        tags[0].text
      )}, ${capitalizeText(tags[1].text)}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
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
      const expectedInfo = `kehus.kehu-received ${kehu.giver_name}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
      expect(component.find(".FeedItem-image").prop("src")).toEqual(
        kehu.giver.picture
      );
    });
  });

  describe("when all info at once", () => {
    it("renders correct info", () => {
      const role = { id: 1, role: "client" };
      const tags = [{ text: "client" }, { text: "customer" }];
      component.setProps({
        kehu: { ...kehu, tags, role, receiver_email: "some@email" }
      });
      const expectedInfo = `kehus.kehu-received ${kehu.giver_name}, ${
        role.role
      }. kehus.skills: ${capitalizeText(tags[0].text)}, ${capitalizeText(
        tags[1].text
      )}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
      expect(component.find(".new-kehu-ribbon").exists()).toBeFalsy();
    });
  });

  describe("when user had saved the kehu role", () => {
    it("renders image", () => {
      const role = { id: 6, role: "client" };
      const src = `/images/role-client.svg`;
      component.setProps({ kehu: { ...kehu, picture: null, role } });
      expect(component.find(".FeedItem-image").prop("src")).toEqual(src);
    });
  });

  describe("when kehu has no picture or role", () => {
    it("does not render image", () => {
      component.setProps({ kehu: { ...kehu, picture: null } });
      expect(component.find(".FeedItem-image").exists()).toBeFalsy();
      expect(component.hasClass("FeedItem--noImage"));
    });
  });
});
