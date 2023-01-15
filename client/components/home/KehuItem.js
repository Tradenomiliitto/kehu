import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { feedKehuPropType, rolePropType } from "../../util/PropTypes";

export class KehuItem extends Component {
  static propTypes = {
    kehu: feedKehuPropType,
    roles: PropTypes.arrayOf(rolePropType),
    // i18n props coming from withTranslation()
    t: PropTypes.func.isRequired,
  };

  render() {
    const { kehu, t } = this.props;

    return (
      <div className="FeedItem">
        {kehu.isNewKehu && (
          <div className="new-kehu-ribbon">
            {t("home.feed.new-kehu-ribbon")}
          </div>
        )}
        {this.renderImage(kehu)}
        <span className="FeedItem-date">
          {moment(kehu.date_given).format("D.M.YYYY")}
        </span>
        <p className="FeedItem-info FeedItem-info--kehuType">
          {getKehuType(kehu, t)}
        </p>
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">
          {getKehuInfo(kehu, t)}
          {renderPublicityIcon(kehu)}
        </p>
      </div>
    );
  }

  renderImage(kehu) {
    // If Kehu type is "others" render special image showing both sender and receiver
    if (kehu.type === "others") return this.renderOthersImage(kehu);

    const src = this.createImageSrc(kehu);
    if (!src) return;

    return (
      <img
        src={src}
        className="FeedItem-image"
        alt={kehu.giver_name}
        referrerPolicy="no-referrer"
      />
    );
  }

  renderOthersImage(kehu) {
    const senderSrc = kehu?.giver?.picture;
    const receiverSrc = kehu?.owner?.picture;

    return (
      <>
        {senderSrc ? (
          <img
            src={senderSrc}
            className="FeedItem-image--others FeedItem-image--others-first"
            alt={kehu.giver_name}
            referrerPolicy="no-referrer"
          />
        ) : (
          // Render empty block if no sender image available to prevent the
          // shift of the receiver image
          <div className="FeedItem-image--others FeedItem-image--others-first"></div>
        )}
        {receiverSrc && (
          <img
            src={receiverSrc}
            className="FeedItem-image--others"
            alt={`${kehu?.owner?.first_name} ${kehu?.owner?.last_name}`}
            referrerPolicy="no-referrer"
          />
        )}
      </>
    );
  }

  createImageSrc(kehu) {
    if (kehu.type === "received" && kehu.giver?.picture) {
      return kehu.giver.picture;
    }

    if (kehu.type === "added" && kehu.role) {
      return `/images/role-${this.sanitizeRole(kehu.role.id)}.svg`;
    }
  }

  sanitizeRole(id) {
    const { roles } = this.props;
    return roles
      .find((r) => r.id === id)
      .imageId.toLowerCase()
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/ /g, "-");
  }
}

const mapStateToProps = (state) => ({
  roles: state.profile.roles,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, null)
)(KehuItem);

export function getKehuInfo(kehu, t) {
  const kehuToWholeGroup = kehu.group_id != null && kehu.owner_id == null;
  let text;

  if (kehu.type === "sent")
    text = kehu?.owner?.first_name ?? kehu.receiver_name;
  else text = kehu.giver_name;

  if (kehu.type === "others") text += ` -> ${kehu.owner.first_name}`;
  if (kehu.type !== "others" && !kehuToWholeGroup) {
    // Add role if defined
    if (kehu?.role?.role) text += `, ${kehu.role.role.toLowerCase()}`;
  }

  // Is kehu for the whole group
  if (kehuToWholeGroup)
    text += ", " + t("kehus.kehu-whole-group", "koko tiimin kehu");

  // Add group name if it's a group Kehu
  if (kehu?.group?.name) text += ` - ${kehu?.group?.name}`;

  return text;
}

export function getKehuType(kehu, t) {
  switch (kehu.type) {
    case "sent":
      return t("kehus.kehu-sent", "Lähetetty kehu");
    case "received":
      return t("kehus.kehu-received", "Vastaanotettu kehu");
    case "added":
      return t("kehus.kehu-added", "Lisätty kehu");
    case "others":
      return t("kehus.kehu-others", "Kehu yhteisössä");
    default:
      return "";
  }
}

export function renderPublicityIcon(kehu) {
  const isPublic = kehu.is_public;

  const imageName = isPublic === true ? "icon-view.png" : "icon-padlock.png";

  return (
    <img
      src={`/images/${imageName}`}
      className={`FeedItem-icon--${isPublic ? "public" : "private"}`}
    />
  );
}
