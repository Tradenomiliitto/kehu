import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function GroupMembers({ members, groupName }) {
  const [t] = useTranslation();

  return (
    <div className="MyGroups-Card">
      <h3 className="MyGroups-title">{t("groups.members", "Jäsenet")}</h3>
      <div className="MyGroups-GroupMemberOverview">
        {groupName} &#8211;{" "}
        {t("groups.member-count", {
          count: members.length,
          defaultValue: "{{count}} jäsen",
          defaultValue_plural: "{{count}} jäsentä",
        })}
        ,{" "}
        {t("groups.admin-count", {
          count: members.filter((member) => member.is_admin).length,
          defaultValue: "{{count}} admin",
          defaultValue_plural: "{{count}} adminia",
        })}
      </div>
      <hr />
      {members.map((member, idx) => (
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
        />
      ))}
    </div>
  );
}

GroupMembers.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupName: PropTypes.string.isRequired,
};

function Member({ name, email, picture, isDarkRow, isAdmin }) {
  const [t] = useTranslation();

  return (
    <div className={`MyGroups-OneMember ${isDarkRow ? "DarkRow" : ""}`}>
      <div className="MyGroups-MemberPicture">
        <img className="MemberPicture-image" src={picture} />
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
    </div>
  );
}

Member.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  picture: PropTypes.string,
  isDarkRow: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
