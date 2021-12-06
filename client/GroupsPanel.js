import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import NoGroups from "./components/groups/NoGroups";
import MyGroups from "./components/groups/MyGroups";
import FeedPanel from "./components/home/FeedPanel";

export function GroupsPanel({ groups, feedItems }) {
  const [t] = useTranslation();

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

GroupsPanel.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object),
  feedItems: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = (state) => ({
  groups: state.group.groups,
  feedItems: state.profile.feedItems,
});

export default connect(mapStateToProps)(GroupsPanel);
