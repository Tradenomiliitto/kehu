import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import ErrorPanel from "../ErrorPanel";
import { sendKehu } from "../../redux/kehu";
import RoleSelectPanel from "./RoleSelectPanel";
import TextField from "./TextField";
import DateGivenField from "./DateGivenField";
import WordCloudField from "./WordCloudField";
import ReceiverNameField from "./ReceiverNameField";
import ReceiverEmailField from "./ReceiverEmailField";
import RoleImage from "./RoleImage";

export class SendKehuForm extends Component {
  static propTypes = {
    sendKehu: PropTypes.func.isRequired,
    error: PropTypes.object,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired
    }).isRequired,
    roles: PropTypes.array.isRequired,
    situations: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      giver_id: props.profile.id,
      giver_name: `${props.profile.first_name} ${props.profile.last_name}`,
      receiver_name: "",
      receiver_email: "",
      role_id: null,
      text: "",
      date_given: moment(),
      tags: [],
      situations: []
    };
  }

  render() {
    if (this.state.preview) {
      return this.renderPreview();
    }
    return this.renderForm();
  }

  renderPreview() {
    const {
      receiver_name,
      receiver_email,
      text,
      date_given,
      role_id
    } = this.state;
    return (
      <div className="SendKehuPreview preview-js">
        {this.renderErrors()}
        <p className="SendKehuPreview-receiver">
          <b>Lähetetään kehun saajalle:</b>
          <br />
          {receiver_name}
          <br />
          {receiver_email}
        </p>
        <div className="KehuQuoteContainer">
          <p className="KehuQuote kehu-text-nw">{text}</p>
        </div>
        <p className="KehuDetails">
          <RoleImage className="KehuDetails-image" id={role_id} />
          <span className="kehu-giver-name-nw">{this.renderGiverName()}</span>
          <br />
          <span className="kehu-date-given-nw">
            {moment(date_given).format("D.M.YYYY")}
          </span>
        </p>
        <div className="KehuTags kehu-tags-nw">
          {this.renderTagsAndSituations()}
        </div>
        <div className="SendKehuPreview-buttons">
          <button
            className="Button Button--fullWidth Button--inverseNoBorders"
            onClick={this.togglePreview}
          >
            Muokkaa Kehua
          </button>
          <button
            className="Button Button--fullWidth send-kehu-js"
            onClick={this.sendKehu}
          >
            Lähetä Kehu
          </button>
        </div>
      </div>
    );
  }

  renderGiverName() {
    const { giver_name, role_id } = this.state;
    const { roles } = this.props;
    if (role_id) {
      const role = roles.find(r => r.id === role_id);
      return `${giver_name}, ${role.role.toLowerCase()}`;
    }
    return giver_name;
  }

  renderTagsAndSituations() {
    const { tags, situations } = this.state;
    return [...tags, ...situations].map((it, i) => {
      return (
        <span className="KehuItem" key={i}>
          {it}
        </span>
      );
    });
  }

  renderForm() {
    const {
      receiver_name,
      receiver_email,
      text,
      date_given,
      tags,
      situations,
      role_id
    } = this.state;
    const { roles, profile } = this.props;
    return (
      <form className="Form form-js" onSubmit={this.togglePreview}>
        {this.renderErrors()}
        <ReceiverNameField
          value={receiver_name}
          handleChange={this.handleChangeWithEvent("receiver_name")}
        />
        <ReceiverEmailField
          value={receiver_email}
          handleChange={this.handleChangeWithEvent("receiver_email")}
        />
        <div className="Form-group">
          <label>Olen Kehun saajan:</label>
          <RoleSelectPanel
            selected={role_id}
            roles={roles}
            handleClick={this.handleRoleChange}
          />
        </div>
        <TextField
          value={text}
          handleChange={this.handleChangeWithEvent("text")}
        />
        <img src={profile.picture} className="SendKehuForm-profileImage" />
        <DateGivenField
          value={date_given}
          handleChange={this.handleChangeWithValue("date_given")}
        />
        <WordCloudField
          id="tags"
          className="Tags"
          cloudItems={this.props.tags}
          label={
            <span>
              Kehun asiasanat
              <br />
              (taidot ja ominaisuudet)
            </span>
          }
          placeholder="Uusi asiasana"
          values={tags}
          handleChange={this.handleChangeWithValue("tags")}
        />
        <WordCloudField
          id="situations"
          className="Situation"
          cloudItems={this.props.situations}
          label="Kehu koskee tilannetta"
          placeholder="Uusi tilanne"
          values={situations}
          handleChange={this.handleChangeWithValue("situations")}
        />
        <input
          type="submit"
          className="Button Button--fullWidth submit-kehu-nw"
          value="Esikatsele ja lähetä"
        />
      </form>
    );
  }

  renderErrors() {
    const { error } = this.props;
    if (error && error.responseJson && error.responseJson.errors) {
      return error.responseJson.errors.map((e, i) => (
        <ErrorPanel key={i} message={e.msg} />
      ));
    }
  }

  handleChangeWithEvent = field => {
    return ({ target: { value } }) => {
      this.setState({ [field]: value });
    };
  };

  handleChangeWithValue = field => {
    return value => {
      this.setState({ [field]: value });
    };
  };

  handleRoleChange = role_id => {
    this.setState({ role_id });
  };

  togglePreview = ev => {
    ev.preventDefault();
    this.setState({ preview: !this.state.preview });
  };

  sendKehu = () => {
    const formData = {
      ...this.state,
      date_given: moment(this.state.date_given).format()
    };
    delete formData.preview;
    this.props.sendKehu(formData);
  };
}

const mapStateToProps = state => ({
  error: state.kehu.error,
  profile: state.profile.profile,
  roles: state.profile.roles,
  situations: state.profile.situations,
  tags: state.profile.tags
});

const mapDispatchToProps = {
  sendKehu
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendKehuForm);
