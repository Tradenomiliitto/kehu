import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import KehuCountPanel from "./KehuCountPanel";
import TopRolesPanel from "./TopRolesPanel";
import TopTagsPanel from "./TopTagsPanel";
import ListItemsPanel from "./ListItemsPanel";
import { FinnishDate } from "../../util/TextUtil";
import { countReportStatistics } from "../../redux/report";
import { kehuPropType } from "../../util/PropTypes";

const PRINTABLE_REPORT_ID = "PrintableReport";

export function savePrintableReport(filename) {
  const input = document.getElementById(PRINTABLE_REPORT_ID);
  return html2canvas(input, {
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
    pdf.save(filename);
  });
}

export function PrintableReport({
  t,
  profile,
  kehus,
  sentKehus,
  unselectedKehus,
  unselectedSentKehus,
  animated,
}) {
  const report = countReportStatistics(
    kehus.filter((kehu) => !unselectedKehus.has(String(kehu.id))),
    sentKehus.filter((kehu) => !unselectedSentKehus.has(String(kehu.id))),
  );

  // Render TOP kehujat bar chart if >5 items, otherwise render list
  let topRoles;
  if (report.roles.length > 5) {
    topRoles = <TopRolesPanel roles={report.roles} animated={animated} />;
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
    <div id={PRINTABLE_REPORT_ID} className="PrintableReport">
      <div className="row row--margins">
        <div className="col col-xs-12 col--centerMargin element--verticalPadding">
          <div className="PrintableReport__Header">
            <div className="col col-xs-9">
              <div className="ReportTitle">
                {t("report.load-report.report-title", "Osaamisprofiili")}
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
                {profile && profile.first_name} {profile && profile.last_name}
              </div>
              <div className="ReportDate">mykehu.fi {FinnishDate()}</div>
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
              animated={animated}
            />
          </div>
          <div className="element--verticalPadding">
            <ListItemsPanel
              title={t("report.situations-title", "Kehutuimmat tilanteet")}
              items={report.situations.slice(0, 5)}
            />
          </div>
        </div>

        <div className="col col-xs-6 col--centerMargin">
          <div className="element--verticalPadding">
            <KehuCountPanel
              text={t("report.number-of-kehus-title", "Sinulla on yhteensä")}
              number={report.numberOfKehus}
              animated={animated}
            />
            <img className="Thumb-image" src="/images/kehu-sent-thumb.png" />
          </div>
          <div className="element--verticalPadding KehuCount--small">
            <KehuCountPanel
              text={t(
                "report.load-report.number-of-sent-kehus-title",
                "Olet lähettänyt Kehuja",
              )}
              number={report.numberOfSentKehus}
              animated={animated}
            />
          </div>
          <div className="element--verticalPadding">{topRoles}</div>
        </div>
      </div>
      <div className="PrintableReport__Footer">
        <div className="Footer__kehu">
          <img className="Footer__kehu-logo" src="/images/kehu-logo.png" />
          <br />
          mykehu.fi
        </div>
        <img className="Footer__tral-logo" src="/images/logo-tral-square.png" />
      </div>
    </div>
  );
}

PrintableReport.propTypes = {
  kehus: PropTypes.arrayOf(kehuPropType).isRequired,
  sentKehus: PropTypes.arrayOf(kehuPropType).isRequired,
  unselectedKehus: PropTypes.object.isRequired,
  unselectedSentKehus: PropTypes.object.isRequired,
  profile: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
  }).isRequired,
  animated: PropTypes.bool,
  // i18n props
  t: PropTypes.func.isRequired,
};

PrintableReport.defaultProps = {
  animated: true,
};

const mapStateToProps = (state) => ({
  kehus: state.kehu.kehus,
  sentKehus: state.kehu.sentKehus,
  unselectedKehus: state.report.unselectedKehus,
  unselectedSentKehus: state.report.unselectedSentKehus,
  profile: state.profile.profile,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps),
)(PrintableReport);
