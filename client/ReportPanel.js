import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import KehuCountPanel from "./components/report/KehuCountPanel";
import TopRolesPanel from "./components/report/TopRolesPanel";
import TopItemsPanel from "./components/report/TopItemsPanel";
import TopTagsPanel from "./components/report/TopTagsPanel";
import ListItemsPanel from "./components/report/ListItemsPanel";
import Portal from "./components/Portal";
import { FinnishDate } from "./util/TextUtil";
import KehuFormModal from "./components/KehuFormModal";
import SelectKehusPanel from "./components/report/SelectKehusPanel";
import { countReportStatistics } from "./redux/report";
import { kehuPropType } from "./util/PropTypes";

export class ReportPanel extends Component {
  static propTypes = {
    kehus: PropTypes.arrayOf(kehuPropType).isRequired,
    sentKehus: PropTypes.arrayOf(kehuPropType).isRequired,
    report: PropTypes.shape({
      numberOfKehus: PropTypes.number.isRequired,
      numberOfSentKehus: PropTypes.number.isRequired,
      roles: PropTypes.array.isRequired,
      situations: PropTypes.array.isRequired,
      tags: PropTypes.array.isRequired,
      unselectedKehus: PropTypes.object,
      unselectedSentKehus: PropTypes.object,
    }).isRequired,
    profile: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
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
      const { t, profile } = this.props;
      const report = this.countReportStatisticsForSelectedKehus();

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

      // Render TOP kehujat bar chart if >5 items, otherwise render list
      let topRoles;
      if (report.roles.length > 5) {
        topRoles = <TopRolesPanel roles={report.roles} />;
      } else {
        // situation and tag arrays have { text, count } objects
        // roles array has {role, count } objects
        // so transformation is required
        let items = report.roles.map((i) => {
          return {
            text: i.role,
            count: i.count,
          };
        });
        topRoles = (
          <div>
            <ListItemsPanel
              title={t("report.top-roles-title", "TOP Kehujat")}
              items={items.slice(0, 5)}
            />
            <img
              className="TopRoles-image"
              src="/images/role-opettaja-selected.svg"
            />
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
                <div id="PrintableReport" className="PrintableReport">
                  <div className="row row--margins">
                    <div className="col col-xs-12 col--centerMargin element--verticalPadding">
                      <div className="PrintableReport__Header">
                        <div className="col col-xs-9">
                          <div className="ReportTitle">
                            {t(
                              "report.load-report.report-title",
                              "Osaamisprofiili",
                            )}
                          </div>
                          <div className="ReportSubtitle">
                            {t(
                              "report.load-report.report-subtitle",
                              "Tämä raportti on koottu yksilöiden antamien palautteiden, Kehujen, perusteella, ja kuvaa omistajansa osaamista ja vahvuuksia",
                            )}
                          </div>
                        </div>
                        <div className="col col-xs-3">
                          <div className="ReportUsername">
                            {profile && profile.first_name}{" "}
                            {profile && profile.last_name}
                          </div>
                          <div className="ReportDate">
                            mykehu.fi {FinnishDate()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row row--margins">
                    <div className="col col-xs-6 col--centerMargin">
                      <div className="element--verticalPadding element--combined">
                        <ListItemsPanel
                          title={t("report.skills-title", "Kehutuimmat taidot")}
                          items={report.tags.slice(0, 5)}
                        />
                        <TopTagsPanel
                          tags={report.tags}
                          title={t("report.skills-title", "Kehutuimmat taidot")}
                        />
                      </div>
                      <div className="element--verticalPadding">
                        <ListItemsPanel
                          title={t(
                            "report.situations-title",
                            "Kehutuimmat tilanteet",
                          )}
                          items={report.situations.slice(0, 5)}
                        />
                      </div>
                    </div>

                    <div className="col col-xs-6 col--centerMargin">
                      <div className="element--verticalPadding">
                        <KehuCountPanel
                          text={t(
                            "report.number-of-kehus-title",
                            "Sinulla on yhteensä",
                          )}
                          number={report.numberOfKehus}
                        />
                        <img
                          className="Thumb-image"
                          src="/images/kehu-sent-thumb.png"
                        />
                      </div>
                      <div className="element--verticalPadding KehuCount--small">
                        <KehuCountPanel
                          text={t(
                            "report.load-report.number-of-sent-kehus-title",
                            "Olet lähettänyt Kehuja",
                          )}
                          number={report.numberOfSentKehus}
                        />
                      </div>
                      <div className="element--verticalPadding">{topRoles}</div>
                    </div>
                  </div>
                  <div className="PrintableReport__Footer">
                    <div className="Footer__kehu">
                      <img
                        className="Footer__kehu-logo"
                        src="/images/kehu-logo.png"
                      />
                      <br />
                      mykehu.fi
                    </div>
                    <img
                      className="Footer__tral-logo"
                      src="/images/logo-tral-square.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {selectKehusPortal}
        </Portal>
      );
    }
  }

  printReport = () => {
    const { t } = this.props;
    const input = document.getElementById("PrintableReport");
    html2canvas(input, {
      scale: 4, // Pdf quality parameter
      scrollY: 0,
      height: input.clientHeight,
      width: input.clientWidth,
    }).then((canvas) => {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas, "JPEG", 0, 0, width, height);
      pdf.save(t("report.load-report.filename", "kehu-raportti.pdf"));
    });
  };

  countReportStatisticsForSelectedKehus() {
    const {
      kehus,
      sentKehus,
      report: { unselectedKehus, unselectedSentKehus },
    } = this.props;

    const selectedKehus = kehus.filter(
      (kehu) => !unselectedKehus.has(String(kehu.id)),
    );
    const selectedSentKehus = sentKehus.filter(
      (kehu) => !unselectedSentKehus.has(String(kehu.id)),
    );
    return countReportStatistics(selectedKehus, selectedSentKehus);
  }
}

const mapStateToProps = (state) => ({
  kehus: state.kehu.kehus,
  sentKehus: state.kehu.sentKehus,
  report: state.report,
  profile: state.profile.profile,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(ReportPanel);
