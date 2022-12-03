import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { capitalizeText } from "../../util/TextUtil";
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
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">{this.createInfo(kehu)}</p>
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

  createInfo(kehu) {
    const { t } = this.props;
    let text = "";

    if (kehu.type === "received") {
      text += t("kehus.kehu-received", "Vastaanotettu kehu");
    } else if (kehu.type === "added") {
      text += t("kehus.kehu-added", "Lisätty kehu");
    } else {
      text += t("kehus.kehu-others", "Kehu ryhmässä");
    }
    text += ": ";

    if (kehu.role && kehu.role.role) {
      text += `${kehu.giver_name}, ${kehu.role.role}`;
    } else {
      text += kehu.giver_name;
    }

    if (kehu.tags && kehu.tags.length) {
      text += `. ${t("kehus.skills", "Asiasanat")}: ${kehu.tags
        .map((t) => t.text)
        .map(capitalizeText)
        .join(", ")}`;
    }

    return text;
  }
}

const mapStateToProps = (state) => ({
  roles: state.profile.roles,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, null)
)(KehuItem);
