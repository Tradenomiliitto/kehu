import React, { Component } from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { withTranslation } from "react-i18next";

export class KehuCountPanel extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props;
    return (
      <div className="ReportElement KehuCount">
        <p className="KehuCount-text">{this.props.text}</p>
        <CountUp
          end={this.props.number}
          duration={2}
          className="KehuCount-count"
        />
        <p className="KehuCount-bottom">
          {t("report.kehu", { count: this.props.number, defaultValue: "KEHU" })}
        </p>
      </div>
    );
  }
}

export default withTranslation()(KehuCountPanel);
