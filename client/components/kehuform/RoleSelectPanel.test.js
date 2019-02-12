import RoleSelectPanel from "./RoleSelectPanel";

describe("client:components:kehuform:RoleSelectPanel", () => {
  let component;
  let handleClickStub;
  const roles = [{ id: 1, role: "role1" }, { id: 8, role: "role2" }];

  beforeEach(() => {
    handleClickStub = jest.fn();
    component = shallow(
      <RoleSelectPanel
        roles={roles}
        disabled={false}
        handleClick={handleClickStub}
      />
    );
  });

  it("does not render active role", () => {
    expect(
      component.find(".RoleSelector-button--selected").exists()
    ).toBeFalsy();
  });

  it("does not render disabled role", () => {
    expect(
      component.find(".RoleSelector-button--disabled").exists()
    ).toBeFalsy();
  });

  it("renders all roles", () => {
    expect(component.find(".RoleSelector-button").length).toEqual(2);
  });

  describe("when role is clicked", () => {
    beforeEach(() => {
      component
        .find(".RoleSelector-button")
        .first()
        .simulate("click", { preventDefault: () => {} });
    });

    it("calls callback with role id", () => {
      expect(handleClickStub).toHaveBeenCalledWith(roles[0].id);
    });

    describe("when role is selected", () => {
      beforeEach(() => {
        component.setProps({ selected: roles[1].id });
      });

      it("renders active role", () => {
        expect(
          component
            .find(".RoleSelector-button")
            .last()
            .hasClass("RoleSelector-button--selected")
        ).toBeTruthy();
        expect(
          component
            .find(".RoleSelector-button")
            .last()
            .hasClass("RoleSelector-button--disabled")
        ).toBeFalsy();
      });

      it("renders disabled role", () => {
        expect(
          component
            .find(".RoleSelector-button")
            .first()
            .hasClass("RoleSelector-button--selected")
        ).toBeFalsy();
        expect(
          component
            .find(".RoleSelector-button")
            .first()
            .hasClass("RoleSelector-button--disabled")
        ).toBeTruthy();
      });
    });
  });

  describe("when element is disabled", () => {
    beforeEach(() => {
      component.setProps({ disabled: true });
      component
        .find(".RoleSelector-button")
        .first()
        .simulate("click", { preventDefault: () => {} });
    });

    it("does not call callback", () => {
      expect(handleClickStub).not.toHaveBeenCalled();
    });
  });

  describe("when should hide self", () => {
    beforeEach(() => {
      component.setProps({ hideSelf: true });
    });

    it("hides role with id 8", () => {
      expect(component.find(".RoleSelector-button").length).toEqual(1);
    });
  });
});
