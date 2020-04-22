import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { LangLink as Link } from "../../util/LangLink";
import KehuItem from "./KehuItem";
import SentKehuItem from "./SentKehuItem";

export class FeedPanel extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  };

  render() {
    const { t } = this.props;
    return (
      <div className="Feed">
        <h1 className="Feed-title">
          {t("home.feed.title", "Viimeaikainen toiminta")}
        </h1>
        {this.renderItems()}
        <Link to="/kehut" className="Button Feed-link">
          {t("home.feed.show-all-btn", "Kaikki Kehut")}
        </Link>
      </div>
    );
  }

  renderItems() {
    return this.props.items.map((it, i) => {
      if (it.id) {
        return <KehuItem key={i} kehu={it} />;
      }
      return <SentKehuItem key={i} kehu={it} />;
    });
  }
}

export default withTranslation()(FeedPanel);
