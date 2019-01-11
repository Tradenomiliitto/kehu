import React, { Component } from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

export default class KehuCountPanel extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="ReportElement KehuCount">
        <p className="KehuCount-text">{this.props.text}</p>
        <CountUp
          end={this.props.number}
          duration={2}
          className="KehuCount-count"
        />
        <p className="KehuCount-bottom">KEHUA</p>
      </div>
    );
  }
}
