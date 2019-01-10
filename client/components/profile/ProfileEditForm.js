import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import InputField from "./InputField";
import { updateProfile } from "../../redux/profile";
import ErrorPanel from "../ErrorPanel";

export class ProfileEditForm extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      first_name: props.profile.first_name,
      last_name: props.profile.last_name,
      email: props.profile.email
    };
  }

  render() {
    const { first_name, last_name, email } = this.state;
    return (
      <Fragment>
        {this.renderErrors()}
        <form className="ProfileEditForm" onSubmit={this.handleSubmit}>
          <InputField
            name="first_name"
            label="Etunimi"
            placeholder="Etunimi"
            value={first_name}
            handleChange={this.handleChange("first_name")}
          />
          <InputField
            name="last_name"
            label="Sukunimi"
            placeholder="Sukunimi"
            value={last_name}
            handleChange={this.handleChange("last_name")}
          />
          <InputField
            name="email"
            label="Sähköposti"
            placeholder="Sähköposti"
            value={email}
            handleChange={this.handleChange("email")}
          />
          <input
            type="submit"
            className="Button Button--fullWidth submit-profile-nw"
            value="Tallenna"
          />
        </form>
      </Fragment>
    );
  }

  renderErrors() {
    const { error } = this.props;
    if (error && error.responseJson && error.responseJson.errors) {
      return error.responseJson.errors.map((e, i) => (
        <ErrorPanel key={i} message={e.msg} />
      ));
    }
    if (error) {
      const message = `Valitettavasti profiilin päivitys epäonnistui. Tapahtui seuraava virhe: ${error}`;
      return <ErrorPanel message={message} />;
    }
  }

  handleChange = field => {
    return ({ target: { value } }) => {
      this.setState({ [field]: value });
    };
  };

  handleSubmit = ev => {
    ev.preventDefault();
    this.props.updateProfile(this.state);
  };
}

const mapStateToProps = state => ({
  error: state.profile.updateProfileError
});

const mapActionsToProps = {
  updateProfile
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ProfileEditForm);
