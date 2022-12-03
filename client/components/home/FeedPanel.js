import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { LangLink } from "../../util/LangLink";
import KehuItem from "./KehuItem";
import SentKehuItem from "./SentKehuItem";
import { feedKehuPropType, feedSentKehuPropType } from "../../util/PropTypes";

export class FeedPanel extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.oneOfType([feedKehuPropType, feedSentKehuPropType])
    ).isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props;
    return (
      <div className="Feed">
        <h1 className="Feed-title">
          {t("home.feed.title", "Viimeaikainen toiminta")}
        </h1>
        {this.renderItems()}
        <LangLink to="/kehut" className="Button Feed-link">
          {t("home.feed.show-all-btn", "Kaikki Kehut")}
        </LangLink>
      </div>
    );
  }

  renderItems() {
    return this.props.items.map((it, i) => {
      if (it.type !== "sent") {
        return (
          <LangLink to="/kehut" className="FeedItem-plainLink" key={i}>
            <KehuItem kehu={it} />
          </LangLink>
        );
      }
      return (
        <LangLink to="/kehut?sent" className="FeedItem-plainLink" key={i}>
          <SentKehuItem kehu={it} />
        </LangLink>
      );
    });
  }
}

export default withTranslation()(FeedPanel);
