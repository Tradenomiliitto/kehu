import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import moment from "moment";
import { resetKehuFormState } from "../../redux/kehu";
import RoleImage from "./RoleImage";
import { capitalizeText } from "../../util/TextUtil";

export class KehuSuccessPanel extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    resetKehuFormState: PropTypes.func.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t, kehu } = this.props;
    return (
      <div className="KehuSuccessPanel kehu-success-nw">
        <div className="KehuQuoteContainer">
          <p className="KehuQuote kehu-text-nw">{kehu.text}</p>
        </div>
        <p className="KehuDetails">
          <RoleImage
            className="KehuDetails-image"
            id={kehu.role && kehu.role.id}
          />
          <span className="kehu-giver-name-nw">{this.renderGiverName()}</span>
          <br />
          <span className="kehu-date-given-nw">
            {moment(kehu.date_given).format("D.M.YYYY")}
          </span>
        </p>
        <div className="KehuTags kehu-tags-nw">
          {this.renderTagsAndSituations()}
        </div>
        <div className="KehuStars">{this.renderStars()}</div>
        {this.renderComment()}
        <button
          className="Button Button--fullWidth KehuCloseButton close-button-nw"
          onClick={this.handleClick}
        >
          {t("modals.close-btn", "Sulje")}
        </button>
      </div>
    );
  }

  renderGiverName() {
    const { kehu } = this.props;
    if (kehu.role) {
      return `${kehu.giver_name}, ${kehu.role.role.toLowerCase()}`;
    }
    return kehu.giver_name;
  }

  renderTagsAndSituations() {
    const {
      kehu: { tags, situations },
    } = this.props;
    return [...tags, ...situations].map((it, i) => {
      return (
        <span className="KehuItem" key={i}>
          {capitalizeText(it.text)}
        </span>
      );
    });
  }

  renderStars() {
    const {
      kehu: { importance },
    } = this.props;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const icon = i <= importance ? "primary" : "secondary";
      const classNames =
        i <= importance
          ? "KehuStars-star stars-important-nw"
          : "KehuStars-star stars-nw";
      stars.push(
        <img
          key={i}
          src={`/images/icon-star-${icon}.png`}
          className={classNames}
        />,
      );
    }

    return stars;
  }

  renderComment() {
    const { kehu } = this.props;
    if (kehu.comment) {
      return <p className="KehuComment">{kehu.comment}</p>;
    }
  }

  handleClick = () => {
    this.props.resetKehuFormState();
  };
}

const mapDispatchToProps = {
  resetKehuFormState,
};

export default compose(
  withTranslation(),
  connect(null, mapDispatchToProps),
)(KehuSuccessPanel);
