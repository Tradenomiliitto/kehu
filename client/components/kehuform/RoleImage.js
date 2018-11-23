import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class RoleImage extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.number.isRequired,
    roles: PropTypes.array.isRequired
  };

  render() {
    const { className, id } = this.props;

    if (!id) {
      return null;
    }

    return (
      <img
        src={`/images/role-${this.sanitizeRole()}.svg`}
        className={className}
      />
    );
  }

  sanitizeRole() {
    const { id, roles } = this.props;
    return roles
      .find(r => r.id === id)
      .role.toLowerCase()
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/ /g, "-");
  }
}

const mapStateToProps = state => ({
  roles: state.profile.roles
});

export default connect(
  mapStateToProps,
  null
)(RoleImage);
