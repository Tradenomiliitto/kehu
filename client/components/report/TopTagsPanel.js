import React, { Component } from "react";
import PropTypes from "prop-types";
import TopTagsChart from "./TopTagsChart";

export default class TopTagsPanel extends Component {
  static propTypes = {
    tags: PropTypes.array.isRequired
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
        <p className="TopTagsPanel-title">Kehutuimmat taidot</p>
        <div className="TopTagsPanel-wrapper">
          <canvas
            className="TopTagsPanel-canvas"
            ref={ref => (this.canvas = ref)}
          />
        </div>
      </div>
    );
  }
}
