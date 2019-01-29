import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KehuCountPanel from "./components/report/KehuCountPanel";
import TopRolesPanel from "./components/report/TopRolesPanel";
import TopItemsPanel from "./components/report/TopItemsPanel";
import TopTagsPanel from "./components/report/TopTagsPanel";

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

  render() {
    const { report } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  report: state.report
});

export default connect(
  mapStateToProps,
  null
)(ReportPanel);
