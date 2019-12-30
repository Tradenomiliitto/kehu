import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ProfileInfoPanel from "./components/profile/ProfileInfoPanel";
import ProfileEditForm from "./components/profile/ProfileEditForm";
import SuccessPanel from "./components/SuccessPanel";
import { deleteProfile, updateProfile } from "./redux/profile";
import { getText } from "./util/ApiUtil";
import { toQueryString } from "./util/TextUtil";

export class ProfilePanel extends Component {
  static propTypes = {
    deleteProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      isEditing: false,
      success: false
    };
  }

  render() {
    const { profile } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 col-md-offset-1">
            <div className="ProfilePanel">
              <div className="container">
                <div className="row">
                  <div className="col col-xs-12">
                    <h1 className="ProfilePanel-title">Profiili</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-xs-12 col-md-6 col-md-push-6">
                    <div className="ProfilePicture">
                      <img
                        src={profile.picture}
                        className="ProfilePicture-image"
                      />
                    </div>
                    <div className="UploadNewProfilePicture">
                      <button
                        onClick={this.uploadWidget}
                        className="Button upload-button"
                      >
                        Vaihda profiilikuva
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
                          Vaihda salasana
                        </a>
                        <a
                          href="/profiili/kirjaudu-ulos"
                          className="Button ProfileActionLink"
                        >
                          Kirjaudu ulos
                        </a>
                        <button
                          className="Button Button--inverse ProfileActionLink ProfileDeleteLink"
                          onClick={this.handleDeleteButtonClick}
                        >
                          Poista käyttäjätunnus
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

  renderSuccessPanel() {
    if (this.state.success) {
      return (
        <SuccessPanel message="Profiilin päivitys onnistui." hideAfter={5000} />
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

  uploadWidget = () => {
    cloudinary.openUploadWidget(
      {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cropping: true,
        croppingAspectRatio: 1,
        showSkipCropButton: false,
        //croppingCoordinatesMode: 'face', // signature generation not working for some reason when using face mode
        multiple: false,
        publicId: "profile_" + this.props.profile.auth0_id,
        uploadSignature: this.generateSignature,
        language: "fi",
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#CFCFCF",
            tabIcon: "#FF96AC",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#FF96AC",
            action: "#FF96AC",
            inactiveTabIcon: "#3B5F5F",
            error: "#ff5f83",
            inProgress: "#0078FF",
            complete: "#DBFFE5",
            sourceBg: "#EDF1F1"
          }
        }
      },
      async (error, result) => {
        // Update profile picture if upload was succesful
        if (result && result.event === "success") {
          this.props.updateProfile(
            {
              picture: result.info.secure_url
            },
            true
          );
        }
      }
    );
  };

  generateSignature = async (callback, params_to_sign) => {
    let path = "/profiili/cloudinary-signature?";
    let params = toQueryString({ data: params_to_sign });
    let signature = await getText(encodeURI(path + params));
    callback(signature);
  };

  handleSuccess = () => {
    this.setState({
      success: true,
      isEditing: false
    });
  };

  toggleEdit = () => {
    this.setState(state => ({ isEditing: !state.isEditing }));
  };

  resetPassword = ev => {
    ev.preventDefault();
    window.PASSWORD_RESET_LOCK.show();
  };

  handleDeleteButtonClick = () => {
    const confirmText = `
Oletko varma, että haluat poistaa käyttäjätunnuksen?

Valitsemalla kyllä sekä profiili että tallennetut kehut poistetaan, eikä sitä voi enää peruuttaa.
`;

    if (confirm(confirmText)) {
      this.props.deleteProfile();
    }
  };
}

const mapStateToProps = state => ({
  profile: state.profile.profile
});

export default connect(
  mapStateToProps,
  {
    deleteProfile,
    updateProfile
  }
)(ProfilePanel);
