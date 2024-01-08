import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import NoGroups from "./components/groups/NoGroups";
import MyGroups from "./components/groups/MyGroups";
import FeedPanel from "./components/home/FeedPanel";
import GroupMembers from "./components/groups/GroupMembers";
import ActiveGroup from "./components/groups/ActiveGroup";
import { sortGroups } from "./util/misc";

const SHOW_MORE_KEHUS_STEP_SIZE = 5;

export default function GroupsPanel() {
  const [t] = useTranslation();
  const [kehusVisible, setKehusVisible] = useState(SHOW_MORE_KEHUS_STEP_SIZE);
  const groupsJoinedUnsorted = useSelector((state) => state.group.groups);
  const invitations = useSelector((state) => state.profile.invitations);
  const activeGroupId = useSelector((state) => state.group.activeGroupId);

  const groupsJoined = sortGroups(groupsJoinedUnsorted);
  // Sort invitation groups most recent invitation first
  const groupsInvitationPending = [...invitations]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((i) => i.group);
  const allGroups = [...groupsInvitationPending, ...groupsJoined];
  const activeGroup =
    activeGroupId == null
      ? allGroups[0]
      : allGroups.find((g) => g.id === activeGroupId);

  if (!activeGroup) return <NoGroups />;

  const showMoreKehus = (ev) => {
    ev.target.blur();
    setKehusVisible((kehusVisible) => kehusVisible + SHOW_MORE_KEHUS_STEP_SIZE);
  };

  const kehusInFeed = [...(activeGroup.kehus ?? [])]
    // Sort Kehus newest first
    .sort((a, b) => new Date(b.date_given) - new Date(a.date_given))
    // Show only set number of newest Kehus
    .slice(0, kehusVisible);

  return (
    <div className="Groups">
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 col-md-9">
            <ActiveGroup group={activeGroup} />
            {activeGroup.invitationPending ? (
              <div className="Feed">
                <h1 className="Feed-title">
                  {t("home.feed.title", "Viimeaikainen toiminta")}
                </h1>
                <div>
                  {t(
                    "home.feed.invite-pending-no-kehus",
                    "Näet ryhmän Kehut, kun olet liittynyt ryhmään",
                  )}
                  .
                </div>
              </div>
            ) : (
              <FeedPanel items={kehusInFeed} />
            )}
            {activeGroup?.kehus?.length > kehusVisible && (
              <button className="Button" onClick={showMoreKehus}>
                {t("groups.show-more-kehus-btn", "Näytä lisää")}
              </button>
            )}
          </div>
          <div className="col col-xs-12 col-md-3">
            <MyGroups
              groups={groupsJoined}
              invitationGroups={groupsInvitationPending}
              activeGroupId={activeGroup?.id}
            />
            <GroupMembers
              members={activeGroup.members}
              groupName={activeGroup.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
