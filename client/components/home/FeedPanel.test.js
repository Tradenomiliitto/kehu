import { FeedPanel } from "./FeedPanel";
import KehuItem from "./KehuItem";
import SentKehuItem from "./SentKehuItem";

describe("client:components:home:FeedPanel", () => {
  let component;

  const kehu = {
    type: "received",
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
    is_public: false,
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

  const items = [
    { ...kehu, id: 1 },
    { ...sentKehu },
    { ...kehu, id: 2 },
    { ...sentKehu },
    { ...kehu, id: 3 },
  ];

  beforeEach(() => {
    component = shallow(<FeedPanel items={items} t={(key) => key} />);
  });

  it("renders KehuItem for all kehus", () => {
    expect(component.find(KehuItem).length).toEqual(3);
  });

  it("renders SentKehuItem for all sent kehus", () => {
    expect(component.find(SentKehuItem).length).toEqual(2);
  });
});
