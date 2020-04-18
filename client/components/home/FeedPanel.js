import React, { Component } from "react";
import PropTypes from "prop-types";
import { LangLink as Link } from "../../util/LangLink";
import KehuItem from "./KehuItem";
import SentKehuItem from "./SentKehuItem";

export default class FeedPanel extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="Feed">
        <h1 className="Feed-title">Viimeaikainen toiminta</h1>
        {this.renderItems()}
        <Link to="/kehut" className="Button Feed-link">
          Kaikki Kehut
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
