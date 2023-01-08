import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { GroupMemberOverview } from "./GroupMemberOverview";
import { MODAL_TYPES } from "../../GroupAdminPanel";

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

export function MemberList({ members, isAdminList, openModal }) {
  return members.map((member, idx) => (
    <Member
      key={member.user.id}
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
}

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  handleClick,
}) {
  const [t] = useTranslation();

  return (
    <div
      className={`MyGroups-OneMember ${isDarkRow ? "DarkRow" : ""} ${
        isAdminList ? "GroupAdmin-OneMember" : ""
      }`}
    >
      <div className="MyGroups-MemberPicture">
        <img
          className="MemberPicture-image"
          src={picture}
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="MyGroups-MemberDetails">
        <div className="MyGroups-MemberName">{name}</div>
        <div className="MyGroups-MemberInfo">{email}</div>
      </div>
      {isAdmin && (
        <div className="MyGroups-MemberAdmin">
          {t("groups.admin", {
            count: 1,
            defaultValue: "Admin",
          })}
        </div>
      )}
      {isAdminList && !isAdmin && (
        <div className="MyGroups-MemberAdmin">
          {t("groups.member", {
            count: 1,
            defaultValue: "Jäsen",
          })}
        </div>
      )}
      <div className="GroupAdmin-MemberListBreak"></div>
      {isAdminList && (
        <>
          <button className="Button--link GroupAdmin-SetAdmin">
            Aseta adminiksi
          </button>
          <button
            className="Button--link GroupAdmin-Remove"
            onClick={() => handleClick(MODAL_TYPES.RemoveMember)}
          >
            Poista yhteisöstä
          </button>
        </>
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
  handleClick: PropTypes.func,
};
