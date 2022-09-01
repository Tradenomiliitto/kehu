import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import NoGroups from "./components/groups/NoGroups";
import MyGroups from "./components/groups/MyGroups";
import FeedPanel from "./components/home/FeedPanel";
import GroupMembers from "./components/groups/GroupMembers";
import ActiveGroup from "./components/groups/ActiveGroup";

const SHOW_MORE_KEHUS_STEP_SIZE = 5;

export default function GroupsPanel() {
  const [t] = useTranslation();
  const [kehusVisible, setKehusVisible] = useState(SHOW_MORE_KEHUS_STEP_SIZE);
  const groups = useSelector((state) => state.group.groups);
  const activeGroupIdx = useSelector((state) => state.group.activeGroupIdx);

  if (groups.length === 0) return <NoGroups />;

  const activeGroup = groups[activeGroupIdx ?? 0];

  const showMoreKehus = (ev) => {
    ev.target.blur();
    setKehusVisible((kehusVisible) => kehusVisible + SHOW_MORE_KEHUS_STEP_SIZE);
  };
  console.log(activeGroup.kehus.slice(0, kehusVisible));

  return (
    <div className="Groups">
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 col-md-9">
            <ActiveGroup group={activeGroup} />
            <FeedPanel items={activeGroup.kehus.slice(0, kehusVisible)} />
            {activeGroup.kehus.length > kehusVisible && (
              <button className="Button" onClick={showMoreKehus}>
                {t("groups.show-more-kehus-btn", "Näytä lisää")}
              </button>
            )}
          </div>
          <div className="col col-xs-12 col-md-3">
            <MyGroups groups={groups} activeGroupIdx={activeGroupIdx} />
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
