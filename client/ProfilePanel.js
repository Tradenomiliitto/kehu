import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ProfileInfoPanel from "./components/profile/ProfileInfoPanel";
import ProfileEditForm from "./components/profile/ProfileEditForm";
import SuccessPanel from "./components/SuccessPanel";

export class ProfilePanel extends Component {
  static propTypes = {
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
                  <div className="col col-xs-12 col-lg-4 col-lg-4 col-lg-push-8">
                    <div className="ProfilePicture">
                      <img
                        src={profile.picture}
                        className="ProfilePicture-image"
                      />
                    </div>
                  </div>
                  <div className="col col-xs-12 col-lg-8 col-lg-pull-4">
                    <div className="row">
                      <div className="col col-xs-8">
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
}

const mapStateToProps = state => ({
  profile: state.profile.profile
});

export default connect(
  mapStateToProps,
  null
)(ProfilePanel);
