import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { removeGroupMember } from "../../redux/group";
import ErrorPanel, { FormattedErrorPanel } from "../ErrorPanel";

export function RemoveMemberModal({ closeModal, member, groupId }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);

  const removeUser = (ev) => {
    dispatch(removeGroupMember(groupId, member.id, closeModal));
    ev.target.blur();
  };

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModal}>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.remove-member1", "Olet poistamassa käyttäjän")}
        </div>
        <div className="GroupAdmin-TextSpacing GroupAdmin-User">
          {member.first_name} {member.last_name}
          <br />
          {member.email}
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.remove-member2", "yhteisöstäsi")}.
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.remove-member4", "Poistettuasi käyttäjän hän")}
          <ul>
            <li>
              {t(
                "groups.admin-view.remove-member5",
                "näkee edelleen koko ryhmän kehut, jotka annettiin hänen ollessa jäsen"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.remove-member6",
                "näkee ryhmän sisällä hänelle annetut kehut"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.remove-member7",
                "ei näe tästä hetkestä eteenpäin mitään, mitä ryhmässä tapahtuu"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.remove-member8",
                "ei näe aiempia ryhmän sisällä jäseneltä toiselle annettuja kehuja, joissa hän itse ei ole osallisena"
              )}
            </li>
          </ul>
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t(
            "groups.admin-view.remove-member9",
            "Henkilö ei saa erillistä ilmoitusta, että hänet on poistettu yhteisöstä."
          )}
        </div>
        <div className="GroupAdmin-AddMemberButtons">
          <button className="Button Button--inverse" onClick={closeModal}>
            {t("groups.admin-view.cancel-btn", "Peruuta")}
          </button>
          <button className="Button Button--fullWidth" onClick={removeUser}>
            {t(
              "groups.admin-view.remove-member-btn",
              "Poista jäsen yhteisöstä"
            )}
          </button>
        </div>
        {error?.responseJson?.type === "LAST_ADMIN_ERROR" ? (
          <ErrorPanel
            message={t(
              "groups.admin-view.remove-last-admin-error",
              "Yhteisön viimeistä admin-käyttäjää ei voi poistaa."
            )}
          />
        ) : (
          <FormattedErrorPanel
            error={error}
            genericMessage={t(
              "groups.admin-view.remove-member-failed",
              "Jäsenen poistaminen epäonnistui"
            )}
          />
        )}
      </KehuFormModal>
    </Portal>
  );
}

RemoveMemberModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
  groupId: PropTypes.number.isRequired,
};
