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
    const imageSrc = this.createImageSrc(kehu);

    return (
      <div className="FeedItem">
        {kehu.isNewKehu && (
          <div className="new-kehu-ribbon">
            {t("home.feed.new-kehu-ribbon")}
          </div>
        )}
        {this.renderImage(kehu, imageSrc)}
        <span className="FeedItem-date">
          {moment(kehu.date_given).format("D.M.YYYY")}
        </span>
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">{this.createInfo(kehu)}</p>
      </div>
    );
  }

  renderImage(kehu, src) {
    if (src) {
      return (
        <img
          src={src}
          className="FeedItem-image"
          alt={kehu.giver_name}
          referrerPolicy="no-referrer"
        />
      );
    }
  }

  createImageSrc(kehu) {
    if (kehu.receiver_email && kehu.giver && kehu.giver.picture) {
      return kehu.giver.picture;
    }
    if (kehu.role) {
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

    if (kehu.receiver_email) {
      text += t("kehus.kehu-received", "Vastaanotettu kehu:") + " ";
    } else {
      text += t("kehus.kehu-added", "Lisätty kehu:") + " ";
    }

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
