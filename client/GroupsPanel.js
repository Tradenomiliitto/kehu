import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import NoGroups from "./components/groups/NoGroups";
import MyGroups from "./components/groups/MyGroups";
import FeedPanel from "./components/home/FeedPanel";

export default function GroupsPanel() {
  const [t] = useTranslation();
  const groups = useSelector((state) => state.group.groups);
  const feedItems = useSelector((state) => state.profile.feedItems);

  if (groups.length === 0) return <NoGroups />;

  return (
    <div className="Groups">
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 col-md-9">
            <div className="Card">
              <h2>Keken tiimi</h2>
            </div>
            <FeedPanel items={feedItems} />
          </div>
          <div className="col col-xs-12 col-md-3">
            <MyGroups groups={groups} />
            <div className="Card">
              <h3>Jäsenet</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
