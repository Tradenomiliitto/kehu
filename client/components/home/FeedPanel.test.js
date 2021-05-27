import { FeedPanel } from "./FeedPanel";
import KehuItem from "./KehuItem";
import SentKehuItem from "./SentKehuItem";

describe("client:components:home:FeedPanel", () => {
  let component;
  const items = [
    { id: 1 },
    { name: "name" },
    { id: 2 },
    { name: "other" },
    { id: 3 },
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
