import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTranslation, useTranslation } from "react-i18next";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import ErrorPanel from "../ErrorPanel";
import { createGroup, resetGroupErrors } from "../../redux/group";
import GroupNameField from "./GroupNameField";
import GroupDescriptionField from "./GroupDescriptionField";
import InviteMembersField from "./InviteMembersField";
import GroupPictureField, { USER_PICTURE } from "./GroupPictureField";

export class CreateGroupForm extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    // mapStateToProps
    error: PropTypes.object,
    userAuth0Id: PropTypes.string.isRequired,
    // mapDispatchToProps
    createGroup: PropTypes.func.isRequired,
    resetGroupErrors: PropTypes.func.isRequired,
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
        cloudinaryPublicId: null,
      },
      errors: {},
    };
    // Ref to modal to use scrollTop if validation gives errors
    this.modalRef = React.createRef();
  }

  render() {
    const { t } = this.props;
    return (
      <Portal>
        <KehuFormModal
          title={t("modals.create-group.title", "Luo yhteisö")}
          closeModal={this.closeForm}
          contentRef={this.modalRef}
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
      <form className="Form">
        {this.renderErrors()}
        <GroupNameField
          value={groupName}
          handleChange={this.handleChangeWithEvent("groupName")}
          errorMessage={this.state.errors.groupName}
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
          errorMessage={this.state.errors.groupPicture}
          userId={this.props.userAuth0Id}
        />
        <input
          type="button"
          onClick={this.showPreview}
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
        <div className="GroupPicturePreview">
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
            "Kun luot yhteisön sinusta tulee yhteisön admin. Adminina voit myöhemmin lisätä jäseniä yhteisöösi.",
          )}
        </div>

        <div className="SendKehuPreview-buttons">
          <button
            className="Button Button--fullWidth Button--inverseNoBorders"
            onClick={this.hidePreview}
          >
            {t("modals.create-group.modify-group-btn", "Muokkaa yhteisöä")}
          </button>
          <button
            className="Button Button--fullWidth submit-send-kehu-nw send-kehu-js"
            onClick={this.createGroup}
          >
            {t(
              "modals.create-group.create-group-btn",
              "Luo yhteisö ja lähetä kutsut",
            )}
          </button>
        </div>
      </div>
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
      let errMessage = error.message;
      if (error?.responseJson?.error)
        errMessage += ": " + error?.responseJson?.error;

      const message = t("modals.create-group.error", {
        error: errMessage,
        defaultValue: `Valitettavasti Yhteisön luominen epäonnistui. Seuraava virhe tapahtui: {{error}}`,
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

  closeForm = () => {
    this.props.resetGroupErrors();
    this.props.closeModal();
  };

  showPreview = (ev) => {
    ev.preventDefault();
    ev.currentTarget.blur();
    if (this.validateInput()) this.setState({ preview: true });
  };

  hidePreview = (ev) => {
    ev.preventDefault();
    ev.currentTarget.blur();
    this.setState({ preview: false });
  };

  createGroup = () => {
    const formData = {
      name: this.state.groupName,
      description: this.state.groupDescription,
      picture: this.state.groupPicture.url,
      members: this.state.membersToInvite,
    };
    // Add Cloudinary public id if using custom user picture
    if (this.state.groupPicture.selectedPicture === USER_PICTURE)
      formData.cloudinaryPublicId = this.state.groupPicture.cloudinaryPublicId;

    this.props.createGroup(formData);
    this.closeForm();
  };

  validateInput() {
    const { t } = this.props;
    const { groupName, groupPicture } = this.state;
    const errors = {};
    let isValid = true;

    if (!groupName) {
      isValid = false;
      errors.groupName = this.props.t(
        "modals.create-group.empty-groupname-error",
        "Yhteisöllä on oltava nimi",
      );
      this.modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (!groupPicture.url) {
      isValid = false;
      errors.groupPicture = t(
        "modals.create-group.empty-grouppicture-error",
        "Yhteisölle on valittava kuva",
      );
    }

    this.setState({ errors });
    return isValid;
  }
}

const mapStateToProps = (state) => ({
  error: state.group.error,
  userAuth0Id: state.profile.profile.auth0_id,
});

const mapDispatchToProps = {
  createGroup,
  resetGroupErrors,
};

export default compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
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
