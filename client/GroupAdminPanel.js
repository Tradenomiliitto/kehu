import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function GroupAdminPanel(props) {
  const { groupId } = props.match.params;
  const [t] = useTranslation();
  const groups = useSelector((state) => state.group.groups);
  const group = groups.find((g) => g.id === parseInt(groupId, 10));

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
        <div className="row">
          <div className="col col-xs-12 col-md-9">
            <div className="MyGroups-Card row">
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
                  {group.members.map((member) => (
                    <div
                      key={member.user.id}
                      className="ActiveGroup-MemberPicture"
                    >
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
                  })}
                </div>
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
