import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import CreateGroupForm from "./CreateGroupForm";
import { selectGroup } from "../../redux/group";

export default function MyGroups({ groups, activeGroupIdx }) {
  const [t] = useTranslation();
  const [isCreateNewGroupVisible, setIsCreateNewGroupVisible] = useState(false);

  return (
    <div className="MyGroups-Card">
      <h3 className="MyGroups-title">
        {t("groups.mygroups-title", "Yhteisöni")}
      </h3>
      {groups.map((group, idx) => (
        <React.Fragment key={group.id}>
          <OneGroup group={group} isActive={activeGroupIdx === idx} />
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
  groups: PropTypes.arrayOf(PropTypes.object),
  activeGroupIdx: PropTypes.number,
};

function OneGroup({ group, isActive }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();

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
            {t("groups.latest-kehu", "Viimeisin kehu")} x.x.xxxx
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
  group: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};
