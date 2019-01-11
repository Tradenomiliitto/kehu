import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KehuCountPanel from "./components/report/KehuCountPanel";
import TopRolesPanel from "./components/report/TopRolesPanel";
import TopItemsPanel from "./components/report/TopItemsPanel";
import Spinner from "./components/Spinner";
import { getKehus } from "./redux/kehu";

export class ReportPanel extends Component {
  static propTypes = {
    report: PropTypes.shape({
      numberOfKehus: PropTypes.number.isRequired,
      numberOfSentKehus: PropTypes.number.isRequired,
      roles: PropTypes.array.isRequired,
      situations: PropTypes.array.isRequired,
      tags: PropTypes.array.isRequired
    }).isRequired,
    kehusLoaded: PropTypes.bool.isRequired
  };

  componentDidMount() {
    if (!this.props.kehusLoaded) {
      this.props.getKehus();
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">{this.renderContent()}</div>
        </div>
      </div>
    );
  }

  renderContent() {
    const { kehusLoaded, report } = this.props;

    if (!kehusLoaded) {
      return <Spinner />;
    }

    return (
      <div className="ReportPanel">
        <div className="row">
          <div className="col col-xs-12 col-md-6 col-xl-3">
            <TopItemsPanel title="Kehutuimmat taidot" items={report.tags} />
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  report: state.report,
  kehusLoaded: state.kehu.kehusLoaded
});

const mapDispatchToProps = {
  getKehus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportPanel);
