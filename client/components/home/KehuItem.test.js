import KehuItem from "./KehuItem";
import moment from "moment";

describe("client:components:home:KehuItem", () => {
  let component;
  const kehu = {
    date_given: "2019-02-10",
    text: "text",
    giver_name: "name"
  };

  beforeEach(() => {
    component = shallow(<KehuItem kehu={kehu} />);
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
      const role = { role: "client" };
      component.setProps({ kehu: { ...kehu, role } });
      const expectedInfo = `${kehu.giver_name}, ${role.role}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
    });
  });

  describe("when tags are given", () => {
    it("renders correct info", () => {
      const tags = [{ text: "client" }, { text: "customer" }];
      component.setProps({ kehu: { ...kehu, tags } });
      const expectedInfo = `${kehu.giver_name}. Asiasanat: ${tags[0].text}, ${
        tags[1].text
      }`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
    });
  });

  describe("when received kehu", () => {
    it("renders correct info", () => {
      component.setProps({ kehu: { ...kehu, receiver_email: "some@email" } });
      const expectedInfo = `Vastaanotettu kehu: ${kehu.giver_name}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
    });
  });

  describe("when all at once", () => {
    it("renders correct info", () => {
      const role = { role: "client" };
      const tags = [{ text: "client" }, { text: "customer" }];
      component.setProps({
        kehu: { ...kehu, tags, role, receiver_email: "some@email" }
      });
      const expectedInfo = `Vastaanotettu kehu: ${kehu.giver_name}, ${
        role.role
      }. Asiasanat: ${tags[0].text}, ${tags[1].text}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
    });
  });
});
