import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ProfileInfoPanel from "./components/profile/ProfileInfoPanel";
import ProfileEditForm from "./components/profile/ProfileEditForm";
import SuccessPanel from "./components/SuccessPanel";
import { deleteProfile, updateProfile } from "./redux/profile";
import { uploadWidget } from "./util/uploadWidget";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

export class ProfilePanel extends Component {
  static propTypes = {
    deleteProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isEditing: false,
      success: false,
    };
  }

  render() {
    const { t, profile } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 col-md-offset-1">
            <div className="ProfilePanel">
              <div className="container">
                <div className="row">
                  <div className="col col-xs-12">
                    <h1 className="ProfilePanel-title">
                      {t("profile.title", "Profiili")}
                    </h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-xs-12 col-md-6 col-md-push-6">
                    <div className="ProfilePicture">
                      <img
                        src={profile.picture}
                        className="ProfilePicture-image"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="UploadNewProfilePicture">
                      <button
                        onClick={this.handleUploadButtonClick}
                        className="Button upload-button"
                      >
                        {t("profile.change-picture-btn", "Vaihda profiilikuva")}
                      </button>
                    </div>
                  </div>
                  <div className="col col-xs-12 col-md-6 col-md-pull-6">
                    <div className="row">
                      <div className="col col-xs-12">
                        <button
                          className="ProfileEditButton"
                          onClick={this.toggleEdit}
                        >
                          <img
                            src={`/images/icon-edit-secondary.png`}
                            className="ProfileEditButton-image"
                          />
                        </button>
                        {this.renderSuccessPanel()}
                        {this.renderContent()}
                        <a
                          href="#"
                          onClick={this.resetPassword}
                          className="Button ProfileActionLink"
                        >
                          {t("profile.change-password-btn", "Vaihda salasana")}
                        </a>
                        <a
                          href={`/profiili/kirjaudu-ulos?redirectLanguage=${this.props.i18n.language}`}
                          className="Button ProfileActionLink"
                        >
                          {t("profile.logout-btn", "Kirjaudu ulos")}
                        </a>
                        <button
                          className="Button Button--inverse ProfileActionLink ProfileDeleteLink delete-profile-nw"
                          onClick={this.handleDeleteButtonClick}
                        >
                          {t("profile.delete-profile", "Poista käyttäjätunnus")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleUploadButtonClick = () => {
    uploadWidget(
      "profile_" + this.props.profile.auth0_id,
      this.props.i18n.language,
      this.pictureUploadCb,
    );
  };

  pictureUploadCb = async (url) => {
    // Update profile picture if upload was succesful
    if (url != null) {
      this.props.updateProfile({ picture: url }, true);
    }
  };

  renderSuccessPanel() {
    const { t } = this.props;
    if (this.state.success) {
      return (
        <SuccessPanel
          message={t(
            "profile.update-successful",
            "Profiilin päivitys onnistui.",
          )}
          hideAfter={5000}
        />
      );
    }
  }

  renderContent() {
    if (this.state.isEditing) {
      return (
        <ProfileEditForm
          profile={this.props.profile}
          onSuccess={this.handleSuccess}
        />
      );
    }
    return <ProfileInfoPanel profile={this.props.profile} />;
  }

  handleSuccess = () => {
    this.setState({
      success: true,
      isEditing: false,
    });
  };

  toggleEdit = () => {
    this.setState((state) => ({ isEditing: !state.isEditing }));
  };

  resetPassword = (ev) => {
    ev.preventDefault();
    window.PASSWORD_RESET_LOCK.show();
  };

  handleDeleteButtonClick = () => {
    const confirmText =
      "\n" +
      this.props.t("profile.confirm-profile-deletion", {
        newline: "\n\n",
        defaultValue:
          "Oletko varma, että haluat poistaa käyttäjätunnuksen?{{newline}}Valitsemalla kyllä sekä profiili että tallennetut kehut poistetaan, eikä sitä voi enää peruuttaa.",
      }) +
      "\n";

    if (confirm(confirmText)) {
      this.props.deleteProfile();
    }
  };
}

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, {
    deleteProfile,
    updateProfile,
  }),
)(ProfilePanel);
