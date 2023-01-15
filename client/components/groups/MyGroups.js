import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import moment from "moment";

import CreateGroupForm from "./CreateGroupForm";
import { selectGroup } from "../../redux/group";
import { groupPropType } from "../../util/PropTypes";
import { getLatestKehu, sortGroups } from "../../util/misc";

export default function MyGroups({ groups, activeGroupId }) {
  const [t] = useTranslation();
  const [isCreateNewGroupVisible, setIsCreateNewGroupVisible] = useState(false);

  return (
    <div className="MyGroups-Card">
      <h3 className="MyGroups-title">
        {t("groups.mygroups-title", "Yhteisöni")}
      </h3>
      {sortGroups(groups).map((group) => (
        <React.Fragment key={group.id}>
          <OneGroup group={group} isActive={group.id === activeGroupId} />
          <hr className="MyGroups-SeparatorLine" />
        </React.Fragment>
      ))}

      <div className="MyGroups-addNewGroupContainer">
        <button
          className="Button GroupsPanel-addGroupButton"
          onClick={() => setIsCreateNewGroupVisible(true)}
        >
          {t("groups.new-group-button", "Luo uusi yhteisö")}
        </button>
      </div>
      {isCreateNewGroupVisible && (
        <CreateGroupForm closeModal={() => setIsCreateNewGroupVisible(false)} />
      )}
    </div>
  );
}

MyGroups.propTypes = {
  groups: PropTypes.arrayOf(groupPropType),
  activeGroupId: PropTypes.number,
};

function OneGroup({ group, isActive }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  // Get the most recent Kehu in the group
  const latestKehu = getLatestKehu(group.kehus);

  return (
    <button
      className={`MyGroups-GroupButton ${
        isActive ? "MyGroups-ActiveGroup" : ""
      }`}
      onClick={() => dispatch(selectGroup({ groupId: group.id }))}
    >
      <div className="MyGroups-OneGroup">
        <div className="MyGroups-GroupPicture">
          <img className="GroupPicture-image" src={group.picture} />
        </div>
        <div className="MyGroups-GroupDetails">
          <div className="MyGroups-GroupName">{group.name}</div>
          <div className="MyGroups-GroupInfo">
            {t("groups.member-count", {
              count: group.members.length,
              defaultValue: "{{count}} jäsen",
              defaultValue_plural: "{{count}} jäsentä",
            })}
          </div>
          <div className="MyGroups-GroupInfo MyGroups-LatestKehu">
            {latestKehu
              ? t("groups.latest-kehu", "Viimeisin kehu") +
                " " +
                moment(latestKehu.date_given).format("D.M.YYYY")
              : "\u00A0"}
          </div>
        </div>
        {!isActive && (
          <img
            className="MyGroups-SelectGroupArrow"
            src="/images/icon-down-arrow.svg"
          />
        )}
      </div>
    </button>
  );
}

OneGroup.propTypes = {
  group: groupPropType.isRequired,
  isActive: PropTypes.bool.isRequired,
};
