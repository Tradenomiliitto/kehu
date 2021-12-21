import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import NoGroups from "./components/groups/NoGroups";
import MyGroups from "./components/groups/MyGroups";
import FeedPanel from "./components/home/FeedPanel";

export default function GroupsPanel() {
  const [t] = useTranslation();
  const groups = useSelector((state) => state.group.groups);
  const activeGroupIdx = useSelector((state) => state.group.activeGroupIdx);

  if (groups.length === 0) return <NoGroups />;

  const activeGroup = groups[activeGroupIdx ?? 0];

  const dummyFeedItem = [{ id: 1, text: "TODO", giver_name: "" }];
  return (
    <div className="Groups">
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 col-md-9">
            <div className="Card">
              <h2>{activeGroup.name}</h2>
            </div>
            <FeedPanel items={dummyFeedItem} />
          </div>
          <div className="col col-xs-12 col-md-3">
            <MyGroups groups={groups} activeGroupIdx={activeGroupIdx} />
            <div className="Card">
              <h3>{t("groups.members", "Jäsenet")}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
