import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

export class ProfileInfoPanel extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
  };

  render() {
    const { t, profile } = this.props;
    return (
      <div className="ProfileInfo">
        <p className="ProfileInfo-label">
          {t("profile.first-name", "Etunimi")}
        </p>
        <p className="ProfileInfo-text">{profile.first_name}</p>
        <p className="ProfileInfo-label">
          {t("profile.last-name", "Sukunimi")}
        </p>
        <p className="ProfileInfo-text">{profile.last_name}</p>
        <p className="ProfileInfo-label">{t("profile.email", "Sähköposti")}</p>
        <p className="ProfileInfo-text">{profile.email}</p>
      </div>
    );
  }
}

export default withTranslation()(ProfileInfoPanel);
