import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getKehus } from "./redux/kehu";
import Spinner from "./components/Spinner";
import KehusTable from "./components/kehus/KehusTable";
import SentKehusTable from "./components/kehus/SentKehusTable";
import ErrorPanel from "./components/ErrorPanel";

export class KehusPanel extends Component {
  static propTypes = {
    getKehus: PropTypes.func.isRequired,
    error: PropTypes.object,
    kehus: PropTypes.array.isRequired,
    kehusLoaded: PropTypes.bool.isRequired,
    roles: PropTypes.array.isRequired,
    sentKehus: PropTypes.array
  };

  constructor() {
    super();
    this.state = {
      showSentKehus: false
    };
  }

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
    const { kehusLoaded } = this.props;

    if (!kehusLoaded) {
      return <Spinner />;
    }

    return (
      <div className="KehusPanel">
        <div className="KehusPanelHeader">
          <h1 className="KehusPanelHeader-title kehus-title-nw">
            Saadut Kehut
          </h1>
          <span className="KehusPanelHeader-text">Vaihda näkymää</span>
          {this.renderToggleButton()}
        </div>
        {this.renderErrors()}
        {this.renderSelectedKehusTable()}
      </div>
    );
  }

  renderToggleButton() {
    const buttonText = this.state.showSentKehus
      ? "Saadut Kehut"
      : "Lähetetyt Kehut";
    return (
      <button
        className="Button KehusPanelHeader-button"
        onClick={this.toggleKehusView}
      >
        {buttonText}
      </button>
    );
  }

  toggleKehusView = () => {
    this.setState({ showSentKehus: !this.state.showSentKehus });
  };

  renderErrors() {
    const { error } = this.props;
    if (error && error.message) {
      const message = `Valitettavasti Kehun poistaminen epäonnistui. Seuraava virhe tapahtui: ${
        error.message
      }.`;
      return <ErrorPanel message={message} />;
    }
  }

  renderSelectedKehusTable() {
    if (this.state.showSentKehus) {
      return (
        <SentKehusTable kehus={this.props.sentKehus} roles={this.props.roles} />
      );
    } else {
      return <KehusTable kehus={this.props.kehus} />;
    }
  }
}

const mapStateToProps = state => ({
  kehus: state.kehu.kehus,
  error: state.kehu.removeKehuError,
  kehusLoaded: state.kehu.kehusLoaded,
  roles: state.profile.roles,
  sentKehus: state.kehu.sentKehus
});

const mapDispatchToProps = {
  getKehus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KehusPanel);
