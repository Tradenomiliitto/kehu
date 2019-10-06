import React, { Component } from "react";
import PropTypes from "prop-types";
import { capitalizeText } from "../../util/TextUtil";

export default class ListItemsPanel extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="ReportElement ListItems">
        <p className="ListItems-title">{this.props.title}</p>
        <div className="ListItems-container">
          <ol>{this.renderListItems()}</ol>
        </div>
      </div>
    );
  }

  renderListItems() {
    const { items } = this.props;
    return items.map((item, i) => {
      return <li key={i}>{capitalizeText(item.text)}</li>;
    });
  }
}
