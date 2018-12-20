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
        <p>Sinulla on yhteensä</p>
        <CountUp end={this.props.number} duration={4} delay={1} />
        <p>KEHUA</p>
      </div>
    );
  }
}
