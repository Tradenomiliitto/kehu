import React, { Component } from "react";
import PropTypes from "prop-types";
import TopTagsChart from "./TopTagsChart";

export default class TopTagsPanel extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
  };

  componentDidMount() {
    this.chart = new TopTagsChart(this.canvas, this.props);
  }

  componentDidUpdate() {
    this.chart.updateData(this.props);
  }

  render() {
    return (
      <div className="TopTagsPanel ReportElement">
        <p className="TopTagsPanel-title">{this.props.title}</p>
        <div className="TopTagsPanel-wrapper">
          <canvas
            className="TopTagsPanel-canvas"
            ref={(ref) => (this.canvas = ref)}
          />
        </div>
      </div>
    );
  }
}
