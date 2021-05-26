import { SendKehuForm } from "./SendKehuForm";
import moment from "moment";
import MockDate from "mockdate";

describe("client:components:kehuform:SendKehuForm", () => {
  let component;
  let sendKehuStub;
  const profile = {
    id: 1,
    first_name: "First",
    last_name: "Last",
    picture: "picture.jpg"
  };
  const error1 = { msg: "error 1" };
  const error2 = { msg: "error 2" };
  const validationErrors = {
    responseJson: {
      errors: [error1, error2]
    }
  };
  const otherError = {
    message: "Random error"
  };
  const roles = [{ id: 1, role: "role1" }];
  const situations = [{ text: "situation" }];
  const tags = [{ text: "tag" }];

  beforeEach(() => {
    MockDate.set("2018-11-17");
    sendKehuStub = jest.fn();
    component = shallow(
      <SendKehuForm
        sendKehu={sendKehuStub}
        profile={profile}
        contacts={[]}
        roles={roles}
        situations={situations}
        tags={tags}
        t={key => key}
      />
    );
  });

  it("initialises empty state", () => {
    expect(component.state()).toEqual({
      preview: false,
      giver_id: profile.id,
      giver_name: `${profile.first_name} ${profile.last_name}`,
      receiver_name: "",
      receiver_email: "",
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

  it("does not render preview", () => {
    expect(component.find(".form-js").exists()).toBeTruthy();
    expect(component.find(".preview-js").exists()).toBeFalsy();
  });

  describe("when form is submitted", () => {
    beforeEach(() => {
      component.simulate("submit", { preventDefault: () => {} });
    });

    it("opens preview", () => {
      expect(component.find(".preview-js").exists()).toBeTruthy();
      expect(component.find(".form-js").exists()).toBeFalsy();
    });

    describe("when kehu is sent", () => {
      beforeEach(() => {
        component
          .find(".send-kehu-js")
          .simulate("click", { preventDefault: () => {} });
      });

      it("sends new kehu", () => {
        expect(sendKehuStub).toHaveBeenCalledWith({
          giver_id: profile.id,
          giver_name: `${profile.first_name} ${profile.last_name}`,
          receiver_name: "",
          receiver_email: "",
          role_id: null,
          text: "",
          date_given: moment().format(),
          tags: [],
          situations: []
        });
      });
    });
  });

  describe("when validation errors are given", () => {
    beforeEach(() => {
      component = shallow(
        <SendKehuForm
          sendKehu={sendKehuStub}
          profile={profile}
          error={validationErrors}
          contacts={[]}
          roles={roles}
          situations={situations}
          tags={tags}
          t={key => key}
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

  describe("when other errors are given", () => {
    beforeEach(() => {
      component = shallow(
        <SendKehuForm
          sendKehu={sendKehuStub}
          profile={profile}
          error={otherError}
          contacts={[]}
          roles={roles}
          situations={situations}
          tags={tags}
          t={key => key}
        />
      );
    });

    it("renders ErrorPanel", () => {
      expect(
        component
          .find("ErrorPanel")
          .first()
          .prop("message")
      ).toEqual(`modals.send-kehu.error`);
    });
  });

  afterEach(() => {
    sendKehuStub.mockClear();
    MockDate.reset();
  });
});
