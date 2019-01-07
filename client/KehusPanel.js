import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getKehus } from "./redux/kehu";
import Spinner from "./components/Spinner";
import KehusTable from "./components/kehus/KehusTable";
import ErrorPanel from "./components/ErrorPanel";

export class KehusPanel extends Component {
  static propTypes = {
    error: PropTypes.object,
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
          <h1 className="KehusPanelHeader-title kehus-title-nw">
            Saadut Kehut
          </h1>
        </div>
        {this.renderErrors()}
        <KehusTable kehus={kehus} />
      </div>
    );
  }

  renderErrors() {
    const { error } = this.props;
    if (error && error.message) {
      const message = `Valitettavasti Kehun poistaminen epäonnistui. Seuraava virhe tapahtui: ${
        error.message
      }.`;
      return <ErrorPanel message={message} />;
    }
  }
}

const mapStateToProps = state => ({
  kehus: state.kehu.kehus,
  error: state.kehu.removeKehuError,
  kehusLoaded: state.kehu.kehusLoaded
});

const mapDispatchToProps = {
  getKehus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KehusPanel);
