import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { GroupMemberOverview } from "./components/groups/GroupMemberOverview";
import { MemberList } from "./components/groups/GroupMembers";
import {
  GroupNameInput,
  GroupDescriptionInput,
} from "./components/groups/AdminInputs";

export default function GroupAdminPanel(props) {
  const { groupId } = props.match.params;
  const [t] = useTranslation();

  const groups = useSelector((state) => state.group.groups);
  const group = groups.find((g) => g.id === parseInt(groupId, 10));

  const [groupName, setGroupName] = useState(group.name);
  const [groupDescription, setGroupDescription] = useState(group.description);

  if (!group)
    return (
      <div className="ErrorCard">
        {t("groups.admin.group-not-found", "Yhteisöä ei löydy")}
      </div>
    );
  if (!group.is_admin)
    return (
      <div className="ErrorCard">
        {t("groups.admin.not-admin", "Et ole ryhmän admin")}
      </div>
    );

  return (
    <div className="Groups">
      <div className="container">
        <div className="GroupAdmin-Card row">
          <div className="col col-xs-12 col-sm-3 GroupAdmin-PictureContainer">
            <div>
              <div className="ActiveGroup-Picture">
                <img className="GroupPicture-image" src={group.picture} />
              </div>
              <button className="Button--link GroupAdmin-ChangePicture ">
                Vaihda kuva
              </button>
            </div>
          </div>

          <div className="col col-xs-12 col-sm-9 col-lg-9 ActiveGroup-Details">
            <div className="GroupAdmin-ContentContainer">
              <GroupNameInput value={groupName} setValue={setGroupName} />
              <GroupDescriptionInput
                value={groupDescription}
                setValue={setGroupDescription}
              />
              <div className="GroupAdmin-MemberDetailsHeader">
                <div>
                  <h3>Jäsenet</h3>
                  <GroupMemberOverview
                    className="GroupAdmin-GroupMemberOverview"
                    groupName={group.name}
                    members={group.members}
                  />
                </div>
                <button className="Button">Kutsu lisää jäseniä</button>
              </div>
              <hr className="GroupAdmin-Separator" />
              <MemberList members={group.members} isAdminList={true} />
              <div className="GroupAdmin-Buttons">
                <button className="Button Button--inverse">Peruuta</button>
                <button className="Button ">Tallenna muutokset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

GroupAdminPanel.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      groupId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
