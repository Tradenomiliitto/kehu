import { AddKehuForm } from "./AddKehuForm";
import moment from "moment";
import MockDate from "mockdate";

describe("client:components:kehuform:AddKehuForm", () => {
  let component;
  let addKehuStub;
  let updateKehuStub;
  const profile = { id: 1 };
  const kehu = {
    id: 2,
    giver_id: 3,
    owner_id: 3,
    giver_name: "Hermanni",
    text: "kehu text",
    date_given: "2018-11-23T17:45:36+02:00",
    role_id: 4,
    importance: 3,
    tags: [{ text: "tag1" }],
    situations: [{ text: "situation1" }],
    comment: "comment",
  };
  const error1 = { msg: "error 1" };
  const error2 = { msg: "error 2" };
  const validationError = {
    responseJson: {
      errors: [error1, error2],
    },
  };
  const otherError = {
    message: "Random error",
  };
  const roles = [{ id: 1, role: "role1" }];
  const situations = [{ text: "situation" }];
  const tags = [{ text: "tag" }];

  beforeEach(() => {
    MockDate.set("2018-11-17");
    addKehuStub = jest.fn();
    updateKehuStub = jest.fn();
  });

  describe("when editable kehu is not given", () => {
    beforeEach(() => {
      component = shallow(
        <AddKehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
          roles={roles}
          situations={situations}
          tags={tags}
          t={(key) => key}
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
        situations: [],
        importance: 0,
        comment: "",
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
          date_given: moment().format(),
          tags: [],
          situations: [],
          importance: 0,
          comment: "",
        });
        expect(updateKehuStub).not.toHaveBeenCalled();
      });
    });
  });

  describe("when editable kehu is given", () => {
    beforeEach(() => {
      component = shallow(
        <AddKehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
          kehu={kehu}
          roles={roles}
          situations={situations}
          tags={tags}
          t={(key) => key}
        />
      );
    });

    it("initialises state from kehu", () => {
      expect(component.state()).toEqual({
        giver_id: kehu.giver_id,
        owner_id: kehu.owner_id,
        giver_name: kehu.giver_name,
        role_id: kehu.role_id,
        text: kehu.text,
        date_given: moment(kehu.date_given),
        tags: kehu.tags.map((t) => t.text),
        situations: kehu.situations.map((s) => s.text),
        importance: kehu.importance,
        comment: kehu.comment,
      });
    });

    describe("when form is submitted", () => {
      it("edits given kehu", () => {
        component.simulate("submit", { preventDefault: () => {} });
        expect(updateKehuStub).toHaveBeenCalledWith(kehu.id, {
          giver_id: kehu.giver_id,
          owner_id: kehu.owner_id,
          giver_name: kehu.giver_name,
          role_id: kehu.role_id,
          text: kehu.text,
          date_given: moment(kehu.date_given).format(),
          tags: kehu.tags.map((t) => t.text),
          situations: kehu.situations.map((s) => s.text),
          importance: kehu.importance,
          comment: kehu.comment,
        });
        expect(addKehuStub).not.toHaveBeenCalled();
      });
    });
  });

  describe("when validation errors are given", () => {
    beforeEach(() => {
      component = shallow(
        <AddKehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
          error={validationError}
          roles={roles}
          situations={situations}
          tags={tags}
          t={(key) => key}
        />
      );
    });

    it("renders ErrorPanel for each error", () => {
      expect(component.find("ErrorPanel").first().prop("message")).toEqual(
        error1.msg
      );
      expect(component.find("ErrorPanel").last().prop("message")).toEqual(
        error2.msg
      );
    });
  });

  describe("when other errors are given", () => {
    beforeEach(() => {
      component = shallow(
        <AddKehuForm
          addKehu={addKehuStub}
          updateKehu={updateKehuStub}
          profile={profile}
          error={otherError}
          roles={roles}
          situations={situations}
          tags={tags}
          t={(key) => key}
        />
      );
    });

    it("renders ErrorPanel", () => {
      expect(component.find("ErrorPanel").first().prop("message")).toEqual(
        `modals.add-kehu.error`
      );
    });
  });

  afterEach(() => {
    addKehuStub.mockClear();
    MockDate.reset();
  });
});
