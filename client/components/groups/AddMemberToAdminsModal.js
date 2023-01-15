import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Portal from "../Portal";
import KehuFormModal from "../KehuFormModal";
import { updateGroupMember } from "../../redux/group";
import { FormattedErrorPanel } from "../ErrorPanel";

export function AddMemberToAdminsModal({ closeModal, member, groupId }) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.group.error);

  const addUserToAdmins = (ev) => {
    dispatch(updateGroupMember(groupId, member.id, true, closeModal));
    ev.target.blur();
  };

  return (
    <Portal>
      <KehuFormModal title="&nbsp;" closeModal={closeModal}>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.add-to-admins1", "Olet asettamassa käyttäjän")}
        </div>
        <div className="GroupAdmin-TextSpacing GroupAdmin-User">
          {member.first_name} {member.last_name}
          <br />
          {member.email}
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.add-to-admins2", "yhteisön adminiksi")}.
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t("groups.admin-view.add-to-admins4", "Adminina hän voi")}
          <ul>
            <li>
              {t(
                "groups.admin-view.add-to-admins5",
                "muokata yhteisön nimeä, kuvausta ja kuvaa"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.add-to-admins6",
                "kutsua lisää jäseniä yhteisöön"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.add-to-admins7",
                "poistaa jäseniä yhteisöstä"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.add-to-admins8",
                "lisätä muita jäseniä admineiksi"
              )}
            </li>
            <li>
              {t(
                "groups.admin-view.add-to-admins9",
                "poistaa admin-oikeudet muilta admineilta"
              )}
            </li>
          </ul>
        </div>
        <div className="GroupAdmin-TextSpacing">
          {t(
            "groups.admin-view.add-to-admins10",
            "Olet edelleen myös itse yhteisön admin."
          )}
        </div>
        <div className="GroupAdmin-AddMemberButtons">
          <button className="Button Button--inverse" onClick={closeModal}>
            {t("groups.admin-view.cancel-btn", "Peruuta")}
          </button>
          <button
            className="Button Button--fullWidth"
            onClick={addUserToAdmins}
          >
            {t("groups.admin-view.add-to-admins-btn", "Aseta adminiksi")}
          </button>
        </div>
        {
          <FormattedErrorPanel
            error={error}
            genericMessage={t(
              "groups.admin-view.add-to-admins-failed",
              "Jäsenen lisääminen adminiksi epäonnistui"
            )}
          />
        }
      </KehuFormModal>
    </Portal>
  );
}

AddMemberToAdminsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
  groupId: PropTypes.number.isRequired,
};
