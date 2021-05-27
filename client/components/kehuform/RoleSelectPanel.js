import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import RoleImage from "./RoleImage";

export default class RoleSelectPanel extends Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        role: PropTypes.string.isRequired,
      })
    ).isRequired,
    selected: PropTypes.number,
    handleClick: PropTypes.func.isRequired,
    hideSelf: PropTypes.bool,
  };

  render() {
    return <div className="RoleSelector">{this.renderRoles()}</div>;
  }

  renderRoles() {
    const { disabled, selected, hideSelf } = this.props;
    const SELF_ID = 8;
    return this.props.roles.map((role) => {
      if (hideSelf && role.id === SELF_ID) {
        return null;
      }
      const buttonClass = cn({
        "RoleSelector-button": true,
        "RoleSelector-button--selected": role.id === selected,
        "RoleSelector-button--disabled":
          disabled || (selected && role.id !== selected),
      });
      return (
        <button
          key={role.id}
          className={buttonClass}
          onClick={this.handleClick(role.id)}
        >
          <RoleImage
            className="RoleSelector-image"
            id={role.id}
            selectedId={selected}
          />
          <p className="RoleSelector-role">{role.role}</p>
        </button>
      );
    });
  }

  handleClick = (id) => {
    return (ev) => {
      ev.preventDefault();
      if (!this.props.disabled) {
        this.props.handleClick(id);
      }
    };
  };
}
