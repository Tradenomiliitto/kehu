import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import moment from "moment";

import { toggleSendKehuFormModal } from "../../redux/portal";
import { LangLink } from "../../util/LangLink";
import { sortMembers } from "../../util/misc";

export default function ActiveGroup({ group }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const admins = group.members.filter((m) => m.is_admin);
  const adminText = group.is_admin
    ? t("groups.is-group-admin", "Olet ryhmän admin")
    : t("groups.admin", {
        count: admins.length,
        defaultValue: "Admin",
        defaultValue_plural: "Adminit",
      }) +
      ": " +
      admins.map((m) => `${m.user.first_name} (${m.user.email})`).join(", ");

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
          {sortMembers(group.members).map((member) => (
            <div key={member.user.id} className="ActiveGroup-MemberPicture">
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
          })}{" "}
          &#8211; {t("groups.joined-group", "liityit yhteisöön")}{" "}
          {moment(group.joined_at).format("D.M.YYYY")}
        </div>

        <div className="row">
          <div
            className={
              "ActiveGroup-Info col col-xs-12 col-md-" +
              (group.is_admin ? "5" : "7")
            }
          >
            <div>{adminText}</div>
          </div>

          <div
            className={"col col-xs-12 col-md-" + (group.is_admin ? "7" : "5")}
          >
            <div className="ActiveGroup-Buttons">
              {group.is_admin && (
                <LangLink
                  to={`/yhteisot/admin/${group.id}`}
                  className="Button Button--inverse"
                >
                  {t("groups.edit-group-btn", "Muokkaa yhteisöä")}
                </LangLink>
              )}
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
