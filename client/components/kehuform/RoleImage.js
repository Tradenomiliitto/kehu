import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class RoleImage extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.number.isRequired,
    roles: PropTypes.array.isRequired,
    selectedId: PropTypes.number
  };

  render() {
    const { className, id } = this.props;

    if (!id) {
      return null;
    }

    return <img src={this.createImageUrl()} className={className} />;
  }

  createImageUrl() {
    return `/images/role-${this.sanitizeRole()}${this.determineVersion()}.svg`;
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

  determineVersion() {
    const { id, selectedId } = this.props;
    if (id === selectedId) {
      return "-selected";
    } else if (!selectedId) {
      return "-active";
    }
    return "";
  }
}

const mapStateToProps = state => ({
  roles: state.profile.roles
});

export default connect(
  mapStateToProps,
  null
)(RoleImage);
