import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { GroupMemberOverview } from "./GroupMemberOverview";
import { MODAL_TYPES } from "../../GroupAdminPanel";
import { sortMembers } from "../../util/misc";
import { invitationPropType } from "../../util/PropTypes";

export default function GroupMembers({ members, groupName }) {
  const [t] = useTranslation();

  return (
    <div className="MyGroups-Card">
      <h3 className="MyGroups-title">{t("groups.members", "Jäsenet")}</h3>
      <GroupMemberOverview
        className="MyGroups-GroupMemberOverview"
        groupName={groupName}
        members={members}
      />

      <hr />
      <MemberList members={members} />
    </div>
  );
}

GroupMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupName: PropTypes.string.isRequired,
};

export function MemberList({ members, invitations, isAdminList, openModal }) {
  // Sort members admins first, then by firstname and lastname
  const memberList = sortMembers(members).map((member, idx) => (
    <Member
      key={"user-" + member.user.id}
      name={
        member.user.first_name +
        (members.filter((m) => m.user.first_name === member.user.first_name)
          .length > 1
          ? ` ${member.user.last_name[0]}.`
          : "")
      }
      email={member.user.email}
      picture={member.user.picture}
      isDarkRow={idx % 2 === 1}
      isAdmin={member.is_admin}
      isAdminList={isAdminList}
      handleClick={(modalType) => openModal(modalType, member.user)}
    />
  ));

  const invitationList = [...(invitations ?? [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((invitation, idx) => (
      <Member
        key={"invitation-" + invitation.id}
        name=""
        email={invitation.email}
        isDarkRow={idx % 2 === 1}
        isAdmin={false}
        isAdminList={true}
        isInvitation={true}
        handleClick={(modalType) => openModal(modalType, invitation)}
      />
    ));

  return [...memberList, ...invitationList];
}

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  invitations: PropTypes.arrayOf(invitationPropType),
  isAdminList: PropTypes.bool,
  openModal: PropTypes.func,
};

function Member({
  name,
  email,
  picture,
  isDarkRow,
  isAdmin,
  isAdminList,
  isInvitation,
  handleClick,
}) {
  const [t] = useTranslation();

  let memberType;

  if (isInvitation) memberType = t("groups.invitation", "Kutsuttu");
  else if (isAdmin) memberType = t("groups.admin", "Admin");
  else if (isAdminList) memberType = t("groups.member", "Jäsen");

  return (
    <div
      className={`MyGroups-OneMember ${isDarkRow ? "DarkRow" : ""} ${
        isAdminList ? "GroupAdmin-OneMember" : ""
      }`}
    >
      <div className="MyGroups-MemberPicture">
        {picture ? (
          <img
            className="MemberPicture-image"
            src={picture}
            referrerPolicy="no-referrer"
          />
        ) : null}
      </div>
      <div className="MyGroups-MemberDetails">
        <div className="MyGroups-MemberName">{name}</div>
        <div className="MyGroups-MemberInfo">{email}</div>
      </div>
      {memberType ? (
        <div className="MyGroups-MemberAdmin">{memberType}</div>
      ) : null}
      <div className="GroupAdmin-MemberListBreak"></div>
      {isAdminList && !isInvitation && (
        <>
          {isAdmin ? (
            <button
              className="Button--link GroupAdmin-SetAdmin"
              onClick={() => handleClick(MODAL_TYPES.RemoveMemberFromAdmins)}
            >
              {t("groups.admin-view.remove-from-admins", "Poista admineista")}
            </button>
          ) : (
            <button
              className="Button--link GroupAdmin-SetAdmin"
              onClick={() => handleClick(MODAL_TYPES.AddMemberToAdmins)}
            >
              {t("groups.admin-view.add-to-admins", "Aseta adminiksi")}
            </button>
          )}
          <button
            className="Button--link GroupAdmin-Remove"
            onClick={() => handleClick(MODAL_TYPES.RemoveMember)}
          >
            {t("groups.admin-view.remove-from-group", "Poista yhteisöstä")}
          </button>
        </>
      )}
      {isInvitation && (
        <button
          className="Button--link GroupAdmin-CancelInvitation"
          onClick={() => handleClick(MODAL_TYPES.CancelInvitation)}
        >
          {t("groups.admin-view.cancel-invitation", "Peru kutsu")}
        </button>
      )}
    </div>
  );
}

Member.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  picture: PropTypes.string,
  isDarkRow: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isAdminList: PropTypes.bool,
  isInvitation: PropTypes.bool,
  handleClick: PropTypes.func,
};
