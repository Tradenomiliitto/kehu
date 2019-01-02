import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export class ProfilePanel extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };

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
                        <div className="ProfileInfo">
                          <p className="ProfileInfo-label">Etunimi</p>
                          <p className="ProfileInfo-text">
                            {profile.first_name}
                          </p>
                          <p className="ProfileInfo-label">Sukunimi</p>
                          <p className="ProfileInfo-text">
                            {profile.last_name}
                          </p>
                          <p className="ProfileInfo-label">Sähköposti</p>
                          <p className="ProfileInfo-text">{profile.email}</p>
                        </div>
                        <a
                          href="#"
                          onClick={this.resetPassword}
                          className="ProfileActionLink"
                        >
                          Vaihda salasana
                        </a>
                        <a
                          href="/profiili/kirjaudu-ulos"
                          className="ProfileActionLink"
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
