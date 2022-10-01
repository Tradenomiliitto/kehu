import { SentKehuItem } from "./SentKehuItem";
import moment from "moment";

describe("client:components:home:SentKehuItem", () => {
  let component;
  const roles = [
    { id: 1, role: "client", imageId: "client" },
    { id: 6, role: "client", imageId: "client" },
  ];
  const kehu = {
    date_given: "2019-02-10",
    giver_name: "name",
    text: "text",
    picture: "/images/picture.svg",
  };

  beforeEach(() => {
    component = shallow(
      <SentKehuItem kehu={kehu} roles={roles} t={(key) => key} />
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
    const expectedInfo = `kehus-sent-kehu: ${kehu.receiver_name}`;
    expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
  });

  describe("when role is given", () => {
    it("renders correct info", () => {
      component.setProps({ kehu: { ...kehu, role_id: 6 } });
      const expectedInfo = `kehus-sent-kehu: ${kehu.receiver_name}, ${roles[1].role}`;
      expect(component.find(".FeedItem-info").text()).toEqual(expectedInfo);
    });
  });
});
