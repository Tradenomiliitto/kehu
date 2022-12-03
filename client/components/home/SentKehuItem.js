import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import moment from "moment";
import { feedKehuPropType, rolePropType } from "../../util/PropTypes";
import { getKehuInfo, getKehuType, renderPublicityIcon } from "./KehuItem";

export class SentKehuItem extends Component {
  static propTypes = {
    kehu: feedKehuPropType,
    roles: PropTypes.arrayOf(rolePropType),
    // i18n props coming from withTranslation()
    t: PropTypes.func.isRequired,
  };

  render() {
    const { kehu } = this.props;
    return (
      <div className="FeedItem">
        <img
          src={kehu.giver.picture}
          className="FeedItem-image"
          alt={kehu.giver_name}
          referrerPolicy="no-referrer"
        />
        <span className="FeedItem-date">
          {moment(kehu.date_given).format("D.M.YYYY")}
        </span>
        <p className="FeedItem-info FeedItem-info--kehuType">
          {getKehuType(kehu, this.props.t)}
        </p>
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">
          {getKehuInfo(kehu, this.props.t)}
          {renderPublicityIcon(kehu)}
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  roles: state.profile.roles,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, null)
)(SentKehuItem);
