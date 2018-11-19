import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getKehus } from "./redux/kehu";
import Spinner from "./components/Spinner";
import KehusTable from "./components/kehus/KehusTable";

export class KehusPanel extends Component {
  static propTypes = {
    kehus: PropTypes.array.isRequired,
    getKehus: PropTypes.func.isRequired,
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
    const { kehusLoaded, kehus } = this.props;

    if (!kehusLoaded) {
      return <Spinner />;
    }

    return (
      <div className="KehusPanel">
        <div className="KehusPanelHeader">
          <h1 className="KehusPanelHeader-title">Saadut Kehut</h1>
        </div>
        <KehusTable kehus={kehus} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  kehus: state.kehu.kehus,
  kehusLoaded: state.kehu.kehusLoaded
});

const mapDispatchToProps = {
  getKehus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KehusPanel);
