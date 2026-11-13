import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { withTranslation } from "react-i18next";
import PrintableReport, { savePrintableReport } from "./PrintableReport";

export class ReportPdfDownload extends Component {
  static propTypes = {
    onDone: PropTypes.func.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  componentDidMount() {
    savePrintableReport(
      this.props.t("report.load-report.filename", "kehu-raportti.pdf"),
    ).finally(() => {
      if (!this.unmounted) this.props.onDone();
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    return ReactDOM.createPortal(
      <div className="PrintableReport-offscreen" aria-hidden="true">
        <PrintableReport animated={false} />
      </div>,
      document.getElementById("portal"),
    );
  }
}

export default withTranslation()(ReportPdfDownload);
