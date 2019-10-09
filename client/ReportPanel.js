import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import KehuCountPanel from "./components/report/KehuCountPanel";
import TopRolesPanel from "./components/report/TopRolesPanel";
import TopItemsPanel from "./components/report/TopItemsPanel";
import TopTagsPanel from "./components/report/TopTagsPanel";
import ListItemsPanel from "./components/report/ListItemsPanel";
import Portal from "./components/Portal";
import { FinnishDate } from "./util/TextUtil";

export class ReportPanel extends Component {
  static propTypes = {
    report: PropTypes.shape({
      numberOfKehus: PropTypes.number.isRequired,
      numberOfSentKehus: PropTypes.number.isRequired,
      roles: PropTypes.array.isRequired,
      situations: PropTypes.array.isRequired,
      tags: PropTypes.array.isRequired
    }).isRequired,
    profile: PropTypes.shape({
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired
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
              Lataa raportti
            </button>
            <div className="ReportPanel">
              <div className="row">
                <div className="col col-xs-12 col-md-6 col-xl-3">
                  <ListItemsPanel
                    title="Kehutuimmat taidot"
                    items={report.tags.slice(0, 5)}
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
                  <ListItemsPanel
                    title="Kehutuimmat tilanteet"
                    items={report.situations.slice(0, 5)}
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
      const { report, profile } = this.props;

      // Render TOP kehujat bar chart if >5 items, otherwise render list
      let topRoles;
      if (report.roles.length > 5) {
        topRoles = <TopRolesPanel roles={report.roles} />;
      } else {
        // situation and tag arrays have { text, count } objects
        // roles array has {role, count } objects
        // so transformation is required
        let items = report.roles.map(i => {
          return {
            text: i.role,
            count: i.count
          };
        });
        topRoles = (
          <div>
            <ListItemsPanel title="TOP Kehujat" items={items.slice(0, 5)} />
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
                  <div className="row row--margins">
                    <div className="col col-xs-12 col--centerMargin element--verticalPadding">
                      <div className="PrintableReport__Header">
                        <div className="col col-xs-9">
                          <div className="ReportTitle">Osaamisprofiili</div>
                          <div className="ReportSubtitle">
                            Tämä raportti on koottu yksilöiden antamien
                            palautteiden, Kehujen, perusteella, ja kuvaa
                            omistajansa osaamista ja vahvuuksia
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
                          title="Kehutuimmat taidot"
                          items={report.tags.slice(0, 5)}
                        />
                        <TopTagsPanel tags={report.tags} />
                      </div>
                      <div className="element--verticalPadding">
                        <ListItemsPanel
                          title="Kehutuimmat tilanteet"
                          items={report.situations.slice(0, 5)}
                        />
                      </div>
                    </div>

                    <div className="col col-xs-6 col--centerMargin">
                      <div className="element--verticalPadding">
                        <KehuCountPanel
                          text="Sinulla on yhteensä"
                          number={report.numberOfKehus}
                        />
                        <img
                          className="Thumb-image"
                          src="/images/kehu-sent-thumb.png"
                        />
                      </div>
                      <div className="element--verticalPadding KehuCount--small">
                        <KehuCountPanel
                          text="Olet lähettänyt Kehuja"
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
        </Portal>
      );
    }
  }

  printReport() {
    const input = document.getElementById("PrintableReport");
    html2canvas(input, {
      scrollY: 0,
      height: input.clientHeight,
      width: input.clientWidth
    }).then(canvas => {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas, "JPEG", 0, 0, width, height);
      pdf.save("kehu-raportti.pdf");
    });
  }
}

const mapStateToProps = state => ({
  report: state.report,
  profile: state.profile.profile
});

export default connect(
  mapStateToProps,
  null
)(ReportPanel);
