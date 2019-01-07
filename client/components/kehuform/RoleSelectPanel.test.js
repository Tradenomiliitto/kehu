import RoleSelectPanel from "./RoleSelectPanel";

describe("client:components:kehuform:RoleSelectPanel", () => {
  let component;
  let handleClickStub;
  const roles = [{ id: 1, role: "role1" }, { id: 2, role: "role2" }];

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
    expect(component.find(".RoleSelector-button--active").exists()).toBeFalsy();
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
            .hasClass("RoleSelector-button--active")
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
});
