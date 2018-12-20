import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KehuCountPanel from "./components/report/KehuCountPanel";
import Spinner from "./components/Spinner";
import { getKehus } from "./redux/kehu";

export class ReportPanel extends Component {
  static propTypes = {
    report: PropTypes.shape({
      numberOfKehus: PropTypes.number.isRequired
    }).isRequired
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
          <div className="col-xs-12 col-md-10 col-md-offset-1">
            {this.renderContent()}
          </div>
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
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-6 col-lg-4">
              <KehuCountPanel number={report.numberOfKehus} />
            </div>
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
