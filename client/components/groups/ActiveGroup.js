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
            <div key={member.user.id} className="ActiveGroup-MemberPicture">
              <img className="MemberPicture-image" src={member.user.picture} />
            </div>
          ))}
        </div>

        <div className="ActiveGroup-Info">
          {t("groups.member-count", {
            count: group.members.length,
            defaultValue: "{{count}} jäsen",
            defaultValue_plural: "{{count}} jäsentä",
          })}{" "}
          &#8211; {t("groups.joined-group", "liityit yhteisöön")}{" "}
          {moment(group.joined_at).format("D.M.YYYY")}
        </div>

        <div className="row">
          <div className="col col-xs-12 col-md-5 ActiveGroup-Info">
            <div>
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

          <div className="col col-xs-12 col-md-7">
            <div className="ActiveGroup-Buttons">
              <button className="Button Button--inverse" disabled>
                {t("groups.edit-group-btn", "Muokkaa yhteisöä")}
              </button>
              <button
                className="Button"
                onClick={() => dispatch(toggleSendKehuFormModal())}
              >
                {t("home.send-new-kehu-btn", "Lähetä Kehu")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ActiveGroup.propTypes = {
  group: PropTypes.object.isRequired,
};
