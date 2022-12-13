import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTranslation, Trans } from "react-i18next";
import moment from "moment";
import ErrorPanel from "../ErrorPanel";
import { sendKehu } from "../../redux/kehu";
import RoleSelectPanel from "./RoleSelectPanel";
import TextField from "./TextField";
import DateGivenField from "./DateGivenField";
import WordCloudField from "./WordCloudField";
import ReceiverNameField from "./ReceiverNameField";
import GroupSelectionField from "./GroupSelectionField";
import ReceiverEmailField from "./ReceiverEmailField";
import ContactsToggle from "./ContactsToggle";
import { capitalizeText } from "../../util/TextUtil";
import VisibilitySelection from "./VisibilitySelection";

export class SendKehuForm extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired,
    sendKehu: PropTypes.func.isRequired,
    error: PropTypes.object,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }).isRequired,
    roles: PropTypes.array.isRequired,
    situations: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    groups: PropTypes.array.isRequired,
    // i18n prop coming from withTranslation()
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      giver_id: props.profile.id,
      giver_name: `${props.profile.first_name} ${props.profile.last_name}`,
      group_name: "-",
      receiver_name: "",
      receiver_email: "",
      isPrivate: null,
      role_id: null,
      text: "",
      date_given: moment(),
      tags: [],
      situations: [],
    };
  }

  render() {
    if (this.state.preview) {
      return this.renderPreview();
    }
    return this.renderForm();
  }

  renderPreview() {
    const { receiver_name, receiver_email, text, date_given } = this.state;
    const { t, profile } = this.props;
    return (
      <div className="SendKehuPreview preview-js">
        {this.renderErrors()}
        <p className="SendKehuPreview-receiver receiver-nw">
          <b>
            {t(
              "modals.send-kehu.preview-receiver",
              "Lähetetään kehun saajalle:"
            )}
          </b>
          <br />
          {receiver_name}
          <br />
          {receiver_email}
        </p>
        <div className="KehuQuoteContainer">
          <p className="KehuQuote kehu-text-nw">{text}</p>
        </div>
        <p className="KehuDetails">
          <img
            src={profile.picture}
            className="KehuDetails-image"
            alt={`${profile.first_name} ${profile.last_name}`}
            referrerPolicy="no-referrer"
          />
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
            {t("modals.send-kehu.modify-kehu-btn", "Muokkaa Kehua")}
          </button>
          <button
            className="Button Button--fullWidth submit-send-kehu-nw send-kehu-js"
            onClick={this.sendKehu}
          >
            {t("modals.send-kehu.send-kehu-btn", "Lähetä Kehu")}
          </button>
        </div>
      </div>
    );
  }

  renderGiverName() {
    const { giver_name, role_id } = this.state;
    const { roles } = this.props;
    if (role_id) {
      const role = roles.find((r) => r.id === role_id);
      return `${giver_name}, ${role.role.toLowerCase()}`;
    }
    return giver_name;
  }

  renderTagsAndSituations() {
    const { tags, situations } = this.state;
    return [...tags, ...situations].map((it, i) => {
      return (
        <span className="KehuItem" key={i}>
          {capitalizeText(it)}
        </span>
      );
    });
  }

  renderForm() {
    const {
      group_name,
      receiver_name,
      receiver_email,
      text,
      date_given,
      tags,
      situations,
      role_id,
    } = this.state;
    const { t, contacts, roles, profile, groups } = this.props;

    const isGroupKehu = group_name !== "-";
    const activeGroup = isGroupKehu
      ? groups.find((group) => group.name === group_name)
      : null;

    // User can send the kehu to whole group. It a special member in the
    // receiver list since it's not a real member of the group
    const groupAsMember = {
      name: t("modals.send-kehu.whole-group", "Koko yhteisö"),
      email: null,
    };
    const isReceiverGroup =
      receiver_name === groupAsMember.name &&
      receiver_email === groupAsMember.email;

    const groupMembers = activeGroup
      ? [groupAsMember].concat(
          activeGroup.members.map((m) => ({
            name: `${m.user.first_name} ${m.user.last_name}`,
            email: m.user.email,
          }))
        )
      : null;

    return (
      <form className="Form form-js" onSubmit={this.togglePreview}>
        {this.renderErrors()}
        <GroupSelectionField
          value={group_name}
          handleChange={this.selectGroup}
        />
        <ReceiverNameField
          value={receiver_name}
          handleChange={this.handleChangeWithEvent("receiver_name")}
          readOnly={isGroupKehu}
        >
          <ContactsToggle
            contacts={isGroupKehu ? groupMembers : contacts}
            handleSelect={this.selectContact}
          />
        </ReceiverNameField>
        {!isGroupKehu && (
          <ReceiverEmailField
            value={receiver_email}
            handleChange={this.handleChangeWithEvent("receiver_email")}
          />
        )}
        {isGroupKehu && (
          <VisibilitySelection
            isPrivate={this.state.isPrivate}
            isReceiverGroup={isReceiverGroup}
            handleChange={this.handleChangeWithValue("isPrivate")}
          />
        )}
        <div className="Form-group">
          <label>
            {t("modals.send-kehu.sender-role-selection", "Olen Kehun saajan:")}
          </label>
          <RoleSelectPanel
            disabled={false}
            hideSelf={true}
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
              <Trans i18nKey="modals.wordcloud.label-tags" />
            </span>
          }
          placeholder={t("modals.wordcloud.placeholder-tags", "Uusi asiasana")}
          values={tags}
          handleChange={this.handleChangeWithValue("tags")}
        />
        <WordCloudField
          id="situations"
          className="Situation"
          cloudItems={this.props.situations}
          label={t(
            "modals.wordcloud.label-situations",
            "Kehu koskee tilannetta"
          )}
          placeholder={t(
            "modals.wordcloud.placeholder-situations",
            "Uusi tilanne"
          )}
          values={situations}
          handleChange={this.handleChangeWithValue("situations")}
        />
        <input
          type="submit"
          className="Button Button--fullWidth submit-kehu-nw"
          value={t(
            "modals.send-kehu.preview-and-submit-btn",
            "Esikatsele ja lähetä"
          )}
        />
      </form>
    );
  }

  renderErrors() {
    const { t, error } = this.props;
    if (error && error.responseJson && error.responseJson.errors) {
      return error.responseJson.errors.map((e, i) => (
        <ErrorPanel key={i} message={e.msg} />
      ));
    }
    if (error && error.message) {
      const message = t("modals.send-kehu.error", {
        error: error.message,
        defaultValue: `Valitettavasti Kehun lähettäminen epäonnistui. Seuraava virhe tapahtui: {{error}}`,
      });
      return <ErrorPanel message={message} />;
    }
  }

  handleChangeWithEvent = (field) => {
    return ({ target: { value } }) => {
      this.setState({ [field]: value });
    };
  };

  handleChangeWithValue = (field) => {
    return (value) => {
      this.setState({ [field]: value });
    };
  };

  selectContact = (receiver_name, receiver_email) => {
    this.setState({ receiver_name, receiver_email });
  };

  selectGroup = (group_name) => {
    this.setState({
      group_name,
      receiver_name: "",
      receiver_email: "",
      isPrivate: null,
    });
  };

  handleRoleChange = (role_id) => {
    this.setState({ role_id });
  };

  togglePreview = (ev) => {
    ev.preventDefault();
    this.setState((state) => ({ preview: !state.preview }));
  };

  sendKehu = () => {
    const formData = {
      receiver_name: this.state.receiver_name,
      receiver_email: this.state.receiver_email,
      role_id: this.state.role_id,
      text: this.state.text,
      tags: this.state.tags,
      situations: this.state.situations,
      date_given: moment(this.state.date_given).format(),
    };

    // Group kehu is going to different endpoint so modify parameters
    const isGroupKehu = this.state.group_name !== "-";
    if (isGroupKehu) {
      const activeGroup = this.props.groups.find(
        (group) => group.name === this.state.group_name
      );
      formData.group_id = activeGroup.id;
      formData.is_public = !this.state.isPrivate;

      // If receiver email is null then the kehu is for the whole group
      // --> replace the `modals.send-kehu.whole-group` string with the actual
      // group name
      if (this.state.receiver_email == null)
        formData.receiver_name = activeGroup.name;
    }

    this.props.sendKehu(formData);
  };
}

const mapStateToProps = (state) => ({
  contacts: state.profile.contacts,
  error: state.kehu.error,
  profile: state.profile.profile,
  roles: state.profile.roles,
  situations: state.profile.situations,
  tags: state.profile.tags,
  groups: state.group.groups,
});

const mapDispatchToProps = {
  sendKehu,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(SendKehuForm);
