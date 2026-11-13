import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import KehuCountPanel from "./components/report/KehuCountPanel";
import TopRolesPanel from "./components/report/TopRolesPanel";
import TopItemsPanel from "./components/report/TopItemsPanel";
import TopTagsPanel from "./components/report/TopTagsPanel";
import ListItemsPanel from "./components/report/ListItemsPanel";
import Portal from "./components/Portal";
import KehuFormModal from "./components/KehuFormModal";
import SelectKehusPanel from "./components/report/SelectKehusPanel";
import PrintableReport, {
  savePrintableReport,
} from "./components/report/PrintableReport";

export class ReportPanel extends Component {
  static propTypes = {
    report: PropTypes.shape({
      numberOfKehus: PropTypes.number.isRequired,
      numberOfSentKehus: PropTypes.number.isRequired,
      roles: PropTypes.array.isRequired,
      situations: PropTypes.array.isRequired,
      tags: PropTypes.array.isRequired,
    }).isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      preview: false,
      isSelectKehusModalVisible: false,
    };
  }

  render() {
    const { t } = this.props;
    const { report } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <button className="Button PreviewButton" onClick={this.openPreview}>
              {t("report.load-report-btn", "Lataa raportti")}
            </button>
            <div className="ReportPanel">
              <div className="row">
                <div className="col col-xs-12 col-md-6 col-xl-3">
                  <ListItemsPanel
                    title={t("report.skills-title", "Kehutuimmat taidot")}
                    items={report.tags.slice(0, 5)}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-5">
                  <TopRolesPanel roles={report.roles} />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-4">
                  <KehuCountPanel
                    text={t(
                      "report.number-of-kehus-title",
                      "Sinulla on yhteensä",
                    )}
                    number={report.numberOfKehus}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-3">
                  <ListItemsPanel
                    title={t(
                      "report.situations-title",
                      "Kehutuimmat tilanteet",
                    )}
                    items={report.situations.slice(0, 5)}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-4">
                  <KehuCountPanel
                    text={t(
                      "report.number-of-sent-kehus-title",
                      "Olet lähettänyt",
                    )}
                    number={report.numberOfSentKehus}
                  />
                </div>
                <div className="col col-xs-12 col-md-6 col-xl-5">
                  <TopTagsPanel
                    tags={report.tags}
                    title={t("report.skills-title", "Kehutuimmat taidot")}
                  />
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

  toggleSelectKehus = () => {
    this.setState({
      isSelectKehusModalVisible: !this.state.isSelectKehusModalVisible,
    });
  };

  renderPortal() {
    if (this.state.preview) {
      const { t } = this.props;

      // Render select kehus dialog
      let selectKehusPortal = "";
      if (this.state.isSelectKehusModalVisible) {
        selectKehusPortal = (
          <div className="selectKehusToReport">
            <KehuFormModal
              title={t("report.select-kehus-title", "Valitse kehut")}
              closeModal={this.toggleSelectKehus}
              hasCloseCross={false}
              hasCloseButton={true}
            >
              <SelectKehusPanel
                sentTitle={t("kehus.title-sent-kehus", "Lähetetyt kehut")}
                receivedTitle={t("kehus.title-received-kehus", "Saadut kehut")}
              />
            </KehuFormModal>
          </div>
        );
      }

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
                    {t("report.load-report.download", "Tallenna")}
                  </button>
                  <button
                    className="Button Button--inverseNoBorders SaveButton"
                    onClick={this.closePreview}
                  >
                    {t("report.load-report.close", "Sulje")}
                  </button>
                  <button
                    className="Button Button--inverseNoBorders SaveButton"
                    onClick={this.toggleSelectKehus}
                  >
                    {t("report.load-report.select-kehus", "Valitse kehut")}
                  </button>
                </div>
                <PrintableReport />
              </div>
            </div>
          </div>
          {selectKehusPortal}
        </Portal>
      );
    }
  }

  printReport = () => {
    savePrintableReport(
      this.props.t("report.load-report.filename", "kehu-raportti.pdf"),
    );
  };
}

const mapStateToProps = (state) => ({
  report: state.report,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(ReportPanel);
