import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export function GroupMemberOverview({ className, groupName, members }) {
  const [t] = useTranslation();

  return (
    <div className={className}>
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
  );
}

GroupMemberOverview.propTypes = {
  className: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  groupName: PropTypes.string.isRequired,
};
