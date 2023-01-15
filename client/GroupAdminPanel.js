import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { GroupMemberOverview } from "./components/groups/GroupMemberOverview";
import { MemberList } from "./components/groups/GroupMembers";
import {
  GroupNameInput,
  GroupDescriptionInput,
} from "./components/groups/AdminInputs";
import { LangLink } from "./util/LangLink";
import { resetGroupErrors, updateGroup } from "./redux/group";
import { AddNewMembersModal } from "./components/groups/AddNewMembersModal";
import { RemoveMemberModal } from "./components/groups/RemoveMemberModal";
import { AddMemberToAdminsModal } from "./components/groups/AddMemberToAdminsModal";
import { RemoveMemberFromAdminsModal } from "./components/groups/RemoveMemberFromAdminsModal";
import { ChangeGroupPictureModal } from "./components/groups/ChangeGroupPictureModal";

export const MODAL_TYPES = {
  AddNewMembers: 0,
  RemoveMember: 1,
  AddMemberToAdmins: 2,
  RemoveMemberFromAdmins: 3,
  ChangeGroupPicture: 4,
};

export default function GroupAdminPanel(props) {
  const { groupId } = props.match.params;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector((state) => state.group.loading);
  const groups = useSelector((state) => state.group.groups);
  const group = groups.find((g) => g.id === parseInt(groupId, 10));

  const [groupName, setGroupName] = useState(group.name);
  const [groupDescription, setGroupDescription] = useState(group.description);
  const [visibleModal, setVisibleModal] = useState(null);
  const [memberInModal, setMemberInModal] = useState();

  const handleSaveClick = async () => {
    dispatch(
      updateGroup(
        { id: groupId, name: groupName, description: groupDescription },
        { history, to: "/yhteisot" }
      )
    );
  };

  const openModal = useCallback(
    (modalType, member) => {
      setVisibleModal(modalType);
      setMemberInModal(member);
    },
    [setVisibleModal, setMemberInModal]
  );

  const closeModal = useCallback(() => {
    setVisibleModal(null);
    dispatch(resetGroupErrors());
  }, [setVisibleModal, dispatch]);

  if (!group)
    return (
      <div className="ErrorCard">
        {t("groups.admin-view.group-not-found", "Yhteisöä ei löydy")}
      </div>
    );
  if (!group.is_admin)
    return (
      <div className="ErrorCard">
        {t("groups.admin-view.not-admin", "Et ole yhteisön admin")}
      </div>
    );

  return (
    <>
      {visibleModal === MODAL_TYPES.AddNewMembers && (
        <AddNewMembersModal closeModal={closeModal} groupId={group.id} />
      )}
      {visibleModal === MODAL_TYPES.RemoveMember && (
        <RemoveMemberModal
          closeModal={closeModal}
          member={memberInModal}
          groupId={group.id}
        />
      )}
      {visibleModal === MODAL_TYPES.AddMemberToAdmins && (
        <AddMemberToAdminsModal
          closeModal={closeModal}
          member={memberInModal}
          groupId={group.id}
        />
      )}
      {visibleModal === MODAL_TYPES.RemoveMemberFromAdmins && (
        <RemoveMemberFromAdminsModal
          closeModal={closeModal}
          member={memberInModal}
          groupId={group.id}
        />
      )}
      {visibleModal === MODAL_TYPES.ChangeGroupPicture && (
        <ChangeGroupPictureModal closeModal={closeModal} groupId={group.id} />
      )}
      <div className="Groups">
        <div className="container">
          <div className="GroupAdmin-Card row">
            <div className="col col-xs-12 col-sm-3 GroupAdmin-PictureContainer">
              <div>
                <div className="ActiveGroup-Picture">
                  <img className="GroupPicture-image" src={group.picture} />
                </div>
                <button
                  className="Button--link GroupAdmin-ChangePicture"
                  onClick={() =>
                    setVisibleModal(MODAL_TYPES.ChangeGroupPicture)
                  }
                >
                  {t("groups.admin-view.change-picture", "Vaihda kuva")}
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
                    <h3>{t("groups.members", "Jäsenet")}</h3>
                    <GroupMemberOverview
                      className="GroupAdmin-GroupMemberOverview"
                      groupName={group.name}
                      members={group.members}
                    />
                  </div>
                  <button
                    className="Button"
                    onClick={() => setVisibleModal(MODAL_TYPES.AddNewMembers)}
                  >
                    {t(
                      "groups.admin-view.invite-members-btn",
                      "Kutsu lisää jäseniä"
                    )}
                  </button>
                </div>
                <hr className="GroupAdmin-Separator" />
                <MemberList
                  members={group.members}
                  isAdminList={true}
                  openModal={openModal}
                />
                <div className="GroupAdmin-Buttons">
                  <LangLink className="Button Button--inverse" to="/yhteisot">
                    {t("groups.admin-view.cancel-btn", "Peruuta")}
                  </LangLink>
                  <button
                    className="Button"
                    disabled={loading}
                    onClick={handleSaveClick}
                  >
                    {t(
                      "groups.admin-view.save-changes-btn",
                      "Tallenna muutokset"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

GroupAdminPanel.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      groupId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
