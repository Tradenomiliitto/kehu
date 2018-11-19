import { KehuForm } from "./KehuForm";
import moment from "moment";
import MockDate from "mockdate";

describe("client:components:kehuform:KehuForm", () => {
  let component;
  let addKehuStub;
  let updateKehuStub;
  const profile = { id: 1 };
  const kehu = {
    id: 2,
    giver_name: "Hermanni",
    text: "kehu text",
    date_given: "2018-09-01",
    tags: [{ text: "tag1" }],
    situations: [{ text: "situation1" }]
  };

  beforeEach(() => {
    MockDate.set("2018-11-17");
    addKehuStub = jest.fn();
    updateKehuStub = jest.fn();
  });

  describe("when editable kehu is not given", () => {
    beforeEach(() => {
      component = shallow(
        <KehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
        />
      );
    });

    it("initialises empty state", () => {
      expect(component.state()).toEqual({
        giver_id: profile.id,
        owner_id: profile.id,
        giver_name: "",
        text: "",
        date_given: moment(),
        tags: [],
        situations: []
      });
    });

    describe("when form is submitted", () => {
      it("adds new kehu", () => {
        component.simulate("submit", { preventDefault: () => {} });
        expect(addKehuStub).toHaveBeenCalledWith({
          giver_id: profile.id,
          owner_id: profile.id,
          giver_name: "",
          text: "",
          date_given: moment().format("D.M.YYYY"),
          tags: [],
          situations: []
        });
        expect(updateKehuStub).not.toHaveBeenCalled();
      });
    });
  });

  describe("when editable kehu is given", () => {
    beforeEach(() => {
      component = shallow(
        <KehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
          kehu={kehu}
        />
      );
    });

    it("initialises state from kehu", () => {
      expect(component.state()).toEqual({
        giver_id: profile.id,
        owner_id: profile.id,
        giver_name: kehu.giver_name,
        text: kehu.text,
        date_given: moment(kehu.date_given),
        tags: kehu.tags.map(t => t.text),
        situations: kehu.situations.map(s => s.text)
      });
    });

    describe("when form is submitted", () => {
      it("edits given kehu", () => {
        component.simulate("submit", { preventDefault: () => {} });
        expect(updateKehuStub).toHaveBeenCalledWith(kehu.id, {
          giver_id: profile.id,
          owner_id: profile.id,
          giver_name: kehu.giver_name,
          text: kehu.text,
          date_given: moment(kehu.date_given).format("D.M.YYYY"),
          tags: kehu.tags.map(t => t.text),
          situations: kehu.situations.map(s => s.text)
        });
        expect(addKehuStub).not.toHaveBeenCalled();
      });
    });
  });

  afterEach(() => {
    addKehuStub.mockClear();
    MockDate.reset();
  });
});
