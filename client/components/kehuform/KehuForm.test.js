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
    role_id: 4,
    tags: [{ text: "tag1" }],
    situations: [{ text: "situation1" }]
  };
  const error1 = { msg: "error 1" };
  const error2 = { msg: "error 2" };
  const error = {
    responseJson: {
      errors: [error1, error2]
    }
  };
  const roles = [{ id: 1, role: "role1" }];

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
          roles={roles}
        />
      );
    });

    it("initialises empty state", () => {
      expect(component.state()).toEqual({
        giver_id: profile.id,
        owner_id: profile.id,
        giver_name: "",
        role_id: null,
        text: "",
        date_given: moment(),
        tags: [],
        situations: []
      });
    });

    it("does not render ErrorPanel", () => {
      expect(component.find("ErrorPanel").exists()).toBeFalsy();
    });

    describe("when form is submitted", () => {
      it("adds new kehu", () => {
        component.simulate("submit", { preventDefault: () => {} });
        expect(addKehuStub).toHaveBeenCalledWith({
          giver_id: profile.id,
          owner_id: profile.id,
          giver_name: "",
          role_id: null,
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
          roles={roles}
        />
      );
    });

    it("initialises state from kehu", () => {
      expect(component.state()).toEqual({
        giver_id: profile.id,
        owner_id: profile.id,
        giver_name: kehu.giver_name,
        role_id: kehu.role_id,
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
          role_id: kehu.role_id,
          text: kehu.text,
          date_given: moment(kehu.date_given).format("D.M.YYYY"),
          tags: kehu.tags.map(t => t.text),
          situations: kehu.situations.map(s => s.text)
        });
        expect(addKehuStub).not.toHaveBeenCalled();
      });
    });
  });

  describe("when errors are given", () => {
    beforeEach(() => {
      component = shallow(
        <KehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
          error={error}
          roles={roles}
        />
      );
    });

    it("renders ErrorPanel for each error", () => {
      expect(
        component
          .find("ErrorPanel")
          .first()
          .prop("message")
      ).toEqual(error1.msg);
      expect(
        component
          .find("ErrorPanel")
          .last()
          .prop("message")
      ).toEqual(error2.msg);
    });
  });

  afterEach(() => {
    addKehuStub.mockClear();
    MockDate.reset();
  });
});
