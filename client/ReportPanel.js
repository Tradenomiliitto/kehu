import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import KehuCountPanel from "./components/report/KehuCountPanel";
import TopRolesPanel from "./components/report/TopRolesPanel";
import TopItemsPanel from "./components/report/TopItemsPanel";
import TopTagsPanel from "./components/report/TopTagsPanel";
import Portal from "./components/Portal";

export class ReportPanel extends Component {
  static propTypes = {
    report: PropTypes.shape({
      numberOfKehus: PropTypes.number.isRequired,
      numberOfSentKehus: PropTypes.number.isRequired,
      roles: PropTypes.array.isRequired,
      situations: PropTypes.array.isRequired,
      tags: PropTypes.array.isRequired
    }).isRequired
  };

  constructor() {
    super();
    this.state = {
      preview: false
    };
  }

  render() {
    const { report } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <button className="Button PreviewButton" onClick={this.openPreview}>
              Esikatsele
            </button>
            <div className="ReportPanel">
              <div className="row">
                <div className="col col-xs-12 col-md-6 col-xl-3">
                  <TopItemsPanel
                    title="Kehutuimmat taidot"
                    items={report.tags}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-5">
                  <TopRolesPanel roles={report.roles} />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-4">
                  <KehuCountPanel
                    text="Sinulla on yhteensä"
                    number={report.numberOfKehus}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-3">
                  <TopItemsPanel
                    title="Kehutuimmat tilanteet"
                    items={report.situations}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-4">
                  <KehuCountPanel
                    text="Olet lähettänyt"
                    number={report.numberOfSentKehus}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-5">
                  <TopTagsPanel tags={report.tags.slice(0, 5)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderPortal()}
      </div>
    );
  }

  openPreview = () => {
    this.setState({ preview: true });
  };

  closePreview = () => {
    this.setState({ preview: false });
  };

  renderPortal() {
    if (this.state.preview) {
      const { report } = this.props;
      return (
        <Portal>
          <div className="PrintableModal">
            <div className="PrintableModal-overlay">
              <div className="PrintableContainer">
                <div className="SaveButtonContainer">
                  <button
                    className="Button SaveButton"
                    onClick={this.printReport}
                  >
                    Tallenna
                  </button>
                  <button
                    className="Button Button--inverseNoBorders SaveButton"
                    onClick={this.closePreview}
                  >
                    Sulje
                  </button>
                </div>
                <div id="PrintableReport" className="PrintableReport">
                  <div className="row">
                    <div className="col col-xs-6">
                      <TopItemsPanel
                        title="Kehutuimmat taidot"
                        items={report.tags}
                      />
                    </div>
                    <div className="col col-xs-6">
                      <TopRolesPanel roles={report.roles} />
                    </div>
                    <div className="col col-xs-6">
                      <KehuCountPanel
                        text="Sinulla on yhteensä"
                        number={report.numberOfKehus}
                      />
                    </div>
                    <div className="col col-xs-6">
                      <TopItemsPanel
                        title="Kehutuimmat tilanteet"
                        items={report.situations}
                      />
                    </div>
                    <div className="col col-xs-6">
                      <KehuCountPanel
                        text="Olet lähettänyt"
                        number={report.numberOfSentKehus}
                      />
                    </div>
                    <div className="col col-xs-6">
                      <TopTagsPanel tags={report.tags.slice(0, 5)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      );
    }
  }

  printReport() {
    const input = document.getElementById("PrintableReport");
    html2canvas(input, {
      scrollY: 0,
      height: 1200,
      width: input.clientWidth
    }).then(canvas => {
      const pdf = new jsPDF("p", "mm", [canvas.width, canvas.height]);
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas, "JPEG", 0, 0, width, height - 20);
      pdf.save("kehu-raportti.pdf");
    });
  }
}

const mapStateToProps = state => ({
  report: state.report
});

export default connect(
  mapStateToProps,
  null
)(ReportPanel);
