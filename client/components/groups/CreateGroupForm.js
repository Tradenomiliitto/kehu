import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTranslation, useTranslation } from "react-i18next";
import moment from "moment";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import ErrorPanel from "../ErrorPanel";
import { sendKehu } from "../../redux/kehu";
import GroupNameField from "./GroupNameField";
import GroupDescriptionField from "./GroupDescriptionField";
import InviteMembersField from "./InviteMembersField";
import GroupPictureField from "./GroupPictureField";

export class CreateGroupForm extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    error: PropTypes.object,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      groupName: "",
      groupDescription: "",
      membersToInvite: [],
      groupPicture: {
        url: "",
        selectedPicture: null,
        userPictureUrl: null,
      },
    };
  }

  render() {
    const { t } = this.props;
    return (
      <Portal>
        <KehuFormModal
          title={t("modals.create-group.title", "Luo yhteisö")}
          closeModal={this.props.closeModal}
        >
          {this.state.preview ? this.renderPreview() : this.renderForm()}
        </KehuFormModal>
      </Portal>
    );
  }

  renderForm() {
    const { groupName, groupDescription, membersToInvite, groupPicture } =
      this.state;
    const { t } = this.props;
    return (
      <form className="Form" onSubmit={this.togglePreview}>
        {this.renderErrors()}
        <GroupNameField
          value={groupName}
          handleChange={this.handleChangeWithEvent("groupName")}
        />
        <GroupDescriptionField
          value={groupDescription}
          handleChange={this.handleChangeWithEvent("groupDescription")}
        />
        <InviteMembersField
          value={membersToInvite}
          handleChange={this.handleChangeWithValue("membersToInvite")}
        />
        <GroupPictureField
          value={groupPicture}
          handleChange={this.handleChangeWithValue("groupPicture")}
        />
        <input
          type="submit"
          className="Button Button--fullWidth"
          value={t("modals.create-group.preview-btn", "Esikatsele")}
        />
      </form>
    );
  }

  renderPreview() {
    const { groupName, groupDescription, membersToInvite, groupPicture } =
      this.state;
    const { t } = this.props;
    return (
      <div className="SendKehuPreview">
        {this.renderErrors()}
        <div
          className={
            "GroupPicturePreview" +
            (groupPicture.url.startsWith("/images") ? " GroupPictureHack" : "")
          }
        >
          <img className="GroupPicture-image" src={groupPicture.url} />
        </div>

        <div className="CreateGroupPreview-GroupName">{groupName}</div>
        <div className="CreateGroupPreview-GroupDescription">
          {groupDescription}
        </div>

        <InvitedMembers membersToInvite={membersToInvite} />

        <div className="CreateGroupPreview-PreviewInfo">
          {t(
            "modals.create-group.preview-info",
            "Kun luot yhteisön sinusta tulee yhteisön admin. Adminina voit myöhemmin lisätä jäseniä yhteisöösi."
          )}
        </div>

        <div className="SendKehuPreview-buttons">
          <button
            className="Button Button--fullWidth Button--inverseNoBorders"
            onClick={this.togglePreview}
          >
            {t("modals.create-group.modify-group-btn", "Muokkaa yhteisöä")}
          </button>
          <button
            className="Button Button--fullWidth submit-send-kehu-nw send-kehu-js"
            onClick={this.createGroup}
          >
            {t(
              "modals.create-group.create-group-btn",
              "Luo yhteisö ja lähetä kutsut"
            )}
          </button>
        </div>
      </div>
    );
  }

  // TODO
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

  togglePreview = (ev) => {
    ev.preventDefault();
    this.setState((state) => ({ preview: !state.preview }));
  };

  // TODO
  createGroup = () => {
    const formData = {
      ...this.state,
      date_given: moment(this.state.date_given).format(),
    };
    delete formData.preview;
    console.log("TODO: luo kehu");
    //this.props.sendKehu(formData);
  };
}

const mapStateToProps = (state) => ({
  error: state.kehu.error,
});

const mapDispatchToProps = {
  sendKehu,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(CreateGroupForm);

function InvitedMembers({ membersToInvite }) {
  const [t] = useTranslation();

  return (
    <div className="CreateGroupPreview-InviteMembers">
      <div className="InviteMembersTitle">
        {t("modals.create-group.members-to-invite", "Kutsutaan jäsenet:")}
      </div>
      {membersToInvite.map((member, idx) => (
        <div className="MemberEmail" key={idx}>
          {member}
        </div>
      ))}
    </div>
  );
}

InvitedMembers.propTypes = {
  membersToInvite: PropTypes.arrayOf(PropTypes.string),
};
