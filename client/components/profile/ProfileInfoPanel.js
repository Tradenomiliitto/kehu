import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ProfileInfoPanel extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };

  render() {
    const { profile } = this.props;
    return (
      <div className="ProfileInfo">
        <p className="ProfileInfo-label">Etunimi</p>
        <p className="ProfileInfo-text">{profile.first_name}</p>
        <p className="ProfileInfo-label">Sukunimi</p>
        <p className="ProfileInfo-text">{profile.last_name}</p>
        <p className="ProfileInfo-label">Sähköposti</p>
        <p className="ProfileInfo-text">{profile.email}</p>
      </div>
    );
  }
}
