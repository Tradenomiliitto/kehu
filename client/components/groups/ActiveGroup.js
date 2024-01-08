import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { toggleSendKehuFormModal } from "../../redux/portal";
import { LangLink } from "../../util/LangLink";
import { sortMembers } from "../../util/misc";
import { LeaveGroupModal } from "./LeaveGroupModal";
import { groupPropType, invitationGroupPropType } from "../../util/PropTypes";
import { acceptInvitation, rejectInvitation } from "../../redux/profile";
import { FormattedErrorPanel } from "../ErrorPanel";

export default function ActiveGroup({ group, invitationId }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.profile.profile.id);
  const invitationError = useSelector((state) => state.profile.invitationError);
  const [leaveGroupModal, setLeaveGroupModal] = useState(false);

  const admins = group.members.filter((m) => m.is_admin);
  const adminText = group.is_admin
    ? t("groups.is-group-admin", "Olet yhteisön admin")
    : t("groups.admin", {
        count: admins.length,
        defaultValue: "Admin",
        defaultValue_plural: "Adminit",
      }) +
      ": " +
      admins.map((m) => `${m.user.first_name} (${m.user.email})`).join(", ");

  const groupJoinedDate = group.invitationPending ? (
    <span className="ActiveGroup-InvitationNotAccepted">
      {t("groups.invite-not-accepted", "Et ole vielä hyväksynyt kutsua")}
    </span>
  ) : (
    t("groups.joined-group", "liityit yhteisöön") +
    " " +
    moment(group.joined_at).format("D.M.YYYY")
  );

  const invitePendingButtons = (
    <div className="ActiveGroup-Buttons">
      <button
        onClick={() => dispatch(rejectInvitation(group.id, invitationId))}
        className="Button Button--inverse"
      >
        {t("groups.reject-invitation-btn", "Hylkää kutsu")}
      </button>
      <button
        className="Button"
        onClick={() => dispatch(acceptInvitation(group.id, invitationId))}
      >
        {t("groups.accept-invitation-btn", "Liity yhteisöön")}
      </button>
    </div>
  );

  const joinedGroupButtons = (
    <div className="ActiveGroup-Buttons">
      <button
        onClick={() => setLeaveGroupModal(true)}
        className="Button Button--inverse"
      >
        {t("groups.leave-group-btn", "Poistu yhteisöstä")}
      </button>
      {group.is_admin && (
        <LangLink
          to={`/yhteisot/admin/${group.id}`}
          className="Button Button--inverse"
        >
          {t("groups.edit-group-btn", "Muokkaa yhteisöä")}
        </LangLink>
      )}
      <button
        className="Button"
        onClick={() => dispatch(toggleSendKehuFormModal(group.name))}
      >
        {t("home.send-new-kehu-btn", "Lähetä Kehu")}
      </button>
    </div>
  );

  const buttons = group.invitationPending
    ? invitePendingButtons
    : joinedGroupButtons;

  return (
    <>
      {leaveGroupModal ? (
        <LeaveGroupModal
          closeModal={() => setLeaveGroupModal(false)}
          memberId={userId}
          groupId={group.id}
          groupName={group.name}
        />
      ) : null}
      <div className="MyGroups-Card row">
        {group.invitationPending && (
          <div className="MyGroups-InvitationBanner">
            {t("groups.invitation-banner", "Kutsu yhteisöön")}
          </div>
        )}
        <div className="col col-xs-12 col-sm-3 ActiveGroup-PictureContainer">
          <div className="ActiveGroup-Picture">
            <img className="GroupPicture-image" src={group.picture} />
          </div>
        </div>

        <div className="col col-xs-12 col-sm-9 ActiveGroup-Details">
          <h2>{group.name}</h2>
          <div className="ActiveGroup-Description">
            {group.description || "\u00A0"}
          </div>

          <div>
            {sortMembers(group.members).map((member) => (
              <div key={member.user.id} className="ActiveGroup-MemberPicture">
                <img
                  className="MemberPicture-image"
                  src={member.user.picture}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>

          <div className="ActiveGroup-Info">
            {t("groups.member-count", {
              count: group.members.length,
              defaultValue: "{{count}} jäsen",
              defaultValue_plural: "{{count}} jäsentä",
            })}{" "}
            &#8211; {groupJoinedDate}
          </div>

          <div className="row">
            <div className={"ActiveGroup-Info col col-xs-12"}>
              <div>{adminText}</div>
            </div>
            <div className={"col col-xs-12"}>{buttons}</div>
          </div>
        </div>
        <FormattedErrorPanel
          error={invitationError}
          genericMessage={t(
            "groups.invitation-accept-or-reject-failed",
            "Yhteisökutsun käsittely epäonnistui",
          )}
        />
      </div>
    </>
  );
}

ActiveGroup.propTypes = {
  group: PropTypes.oneOfType([groupPropType, invitationGroupPropType])
    .isRequired,
  invitationId: PropTypes.number,
};
