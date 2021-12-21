import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import CreateGroupForm from "./CreateGroupForm";

export default function MyGroups({ groups }) {
  const [t] = useTranslation();
  const [isCreateNewGroupVisible, setIsCreateNewGroupVisible] = useState(false);

  return (
    <div className="Card">
      <h3 className="MyGroups-title">
        {t("groups.mygroups.title", "Yhteisöni")}
      </h3>
      {groups.map((group) => (
        <div key={group.id}>
          <div className="MyGroups-OneGroup">
            <div className="MyGroups-GroupPicture">
              <img className="GroupPicture-image" src={group.picture} />
            </div>
            <div className="MyGroups-GroupDetails">
              <div className="MyGroups-GroupName">{group.name}</div>
              <div className="MyGroups-GroupInfo">
                {t("groups.mygroups.member-count", {
                  count: group.members.length,
                  defaultValue: "{{count}} jäsen",
                  defaultValue_plural: "{{count}} jäsentä",
                })}
              </div>
              <div className="MyGroups-GroupInfo">Viimeisin kehu x.x.xxxx</div>
            </div>
          </div>
          <hr />
        </div>
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
};
