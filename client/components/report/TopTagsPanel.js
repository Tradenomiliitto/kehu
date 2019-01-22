import React, { Component } from "react";
import PropTypes from "prop-types";
import PieChart from "react-svg-piechart";

const COLORS = ["#3EABAB", "#FF96AC", "#3B5F5F", "#F3BBC8", "#FAE6EB"];

export default class TopTagsPanel extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired
  };

  constructor() {
    super();
    this.state = { rendered: false };
  }

  componentDidMount() {
    this.setState({ rendered: true });
  }

  render() {
    return (
      <div className="TopTagsPanel ReportElement">
        <PieChart
          data={this.getData()}
          transitionDuration=".2s"
          transitionTimingFunction="ease-in-out"
        />
        {this.renderLabels()}
      </div>
    );
  }

  getData() {
    return this.props.tags.map((tag, i) => ({
      value: tag.count,
      title: tag.text,
      color: COLORS[i]
    }));
  }

  renderLabels() {
    return this.props.tags.map((tag, i) => {
      if (!this.state.rendered) {
        return null;
      }
      const elem = document.querySelector(`[fill="${COLORS[i]}"]`);
      const rect = elem.getBoundingClientRect();
      const parentRect = elem.parentElement.getBoundingClientRect();
      const relativeTop =
        rect.top + window.screenY - (parentRect.top + window.screenY);
      const relativeLeft =
        rect.left + window.screenX - (parentRect.left + window.screenX);

      let style = {
        position: "absolute"
      };

      if (rect.top === parentRect.top) {
        style.top = rect.height / 3;
      } else if (rect.bottom === parentRect.bottom) {
        style.bottom = rect.height / 3;
      } else {
        style.top = relativeTop + rect.height / 2;
      }

      if (rect.left === parentRect.left) {
        style.left = rect.width / 3;
      } else if (rect.right === parentRect.right) {
        style.right = rect.width / 3;
      } else {
        style.left = relativeLeft + rect.width / 3;
      }

      return (
        <span key={i} className="TopTagsPanel-label" style={style}>
          {tag.text}
        </span>
      );
    });
  }
}
