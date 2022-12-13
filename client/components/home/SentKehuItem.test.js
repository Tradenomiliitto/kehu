import { SentKehuItem } from "./SentKehuItem";
import moment from "moment";

describe("client:components:home:SentKehuItem", () => {
  let component;
  const roles = [
    { id: 1, role: "client", imageId: "client" },
    { id: 6, role: "client", imageId: "client" },
  ];
  const kehu = {
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
    const expectedInfo = `${kehu.receiver_name}`;
    expect(
      component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
    ).toEqual(expectedInfo);
  });

  describe("when role is given", () => {
    it("renders correct info", () => {
      component.setProps({ kehu: { ...kehu, role_id: 6 } });
      const expectedInfo = `${kehu.receiver_name}`;
      expect(
        component.find(".FeedItem-info:not(.FeedItem-info--kehuType)").text()
      ).toEqual(expectedInfo);
    });
  });
});
