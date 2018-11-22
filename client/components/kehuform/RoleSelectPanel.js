import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

export default class RoleSelectPanel extends Component {
  static propTypes = {
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        role: PropTypes.string.isRequired
      })
    ).isRequired,
    selected: PropTypes.number,
    handleClick: PropTypes.func.isRequired
  };

  render() {
    return <div className="RoleSelector">{this.renderRoles()}</div>;
  }

  renderRoles() {
    const { selected } = this.props;
    return this.props.roles.map(role => {
      const buttonClass = cn({
        "RoleSelector-button": true,
        "RoleSelector-button--active": role.id === selected
      });
      return (
        <button
          key={role.id}
          className={buttonClass}
          onClick={this.handleClick(role.id)}
        >
          <p className="RoleSelector-role">{role.role}</p>
          <img
            src={`/images/role-${role.role.toLowerCase()}.svg`}
            className="RoleSelector-image"
          />
        </button>
      );
    });
  }

  handleClick = id => {
    return ev => {
      ev.preventDefault();
      this.props.handleClick(id);
    };
  };
}
