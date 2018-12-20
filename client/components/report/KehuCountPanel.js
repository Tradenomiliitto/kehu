import React, { Component } from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

export default class KehuCountPanel extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired
  };

  render() {
    return (
      <div className="ReportElement KehuCount">
        <p className="KehuCount-text">Sinulla on yhteensä</p>
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
