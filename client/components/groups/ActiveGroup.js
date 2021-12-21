import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import moment from "moment";

import { toggleSendKehuFormModal } from "../../redux/portal";

export default function ActiveGroup({ group }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const admins = group.members.filter((m) => m.is_admin);

  return (
    <div className="Card MyGroups-ActiveGroup">
      <div className="MyGroups-ActiveGroupPicture">
        <img className="GroupPicture-image" src={group.picture} />
      </div>
      <div className="MyGroups-ActiveGroupDetails">
        <h2>{group.name}</h2>
        <div className="MyGroups-ActiveGroupDescription">
          {group.description || "\u00A0"}
        </div>
        <div>
          {group.members.map((member) => (
            <div key={member.user.id} className="MyGroups-ActiveMemberPicture">
              <img className="MemberPicture-image" src={member.user.picture} />
            </div>
          ))}
        </div>
        <div className="MyGroups-ActiveGroupInfo">
          {t("groups.member-count", {
            count: group.members.length,
            defaultValue: "{{count}} jäsen",
            defaultValue_plural: "{{count}} jäsentä",
          })}{" "}
          &#8211; {t("groups.joined-group", "liityit yhteisöön")}{" "}
          {moment(group.joined_at).format("D.M.YYYY")}
          <br />
          {t("groups.admin", {
            count: admins.length,
            defaultValue: "Admin",
            defaultValue_plural: "Adminit",
          })}
          :{" "}
          {admins
            .map((m) => `${m.user.first_name} (${m.user.email})`)
            .join(", ")}
        </div>
      </div>
      <button
        className="Button MyGroups-SendKehuBtn"
        onClick={() => dispatch(toggleSendKehuFormModal())}
      >
        {t("home.send-new-kehu-btn", "Lähetä Kehu")}
      </button>
    </div>
  );
}

ActiveGroup.propTypes = {
  group: PropTypes.object.isRequired,
};
