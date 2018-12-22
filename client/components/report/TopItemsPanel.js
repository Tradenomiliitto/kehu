import React, { Component } from "react";
import PropTypes from "prop-types";
import TagCloud from "react-tag-cloud";
import cn from "classnames";

export default class TopItemsPanel extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="ReportElement TopItems">
        <p className="TopItems-title">{this.props.title}</p>
        <div className="TopItems-container">
          <div className="TopItems-wrapper">
            <TagCloud
              style={{
                fontFamily: '"Work Sans", sans-serif',
                fontWeight: 300,
                padding: 1,
                width: "100%",
                height: "100%"
              }}
              className="TopItemsCloud"
            >
              {this.renderCloudItems()}
            </TagCloud>
          </div>
        </div>
      </div>
    );
  }

  renderCloudItems() {
    const { items } = this.props;
    return items.map((item, i) => {
      const classNames = cn({
        "TopItemsCloud-item": true,
        "TopItemsCloud-item--medium": i < 6,
        "TopItemsCloud-item--large": i === 0 || i === 1
      });
      return (
        <div key={i} className={classNames}>
          {item.text}
        </div>
      );
    });
  }
}
