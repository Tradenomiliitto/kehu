import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KehusTable from "./components/kehus/KehusTable";
import SentKehusTable from "./components/kehus/SentKehusTable";
import ErrorPanel from "./components/ErrorPanel";

export class KehusPanel extends Component {
  static propTypes = {
    error: PropTypes.object,
    kehus: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    sentKehus: PropTypes.array
  };

  constructor() {
    super();
    this.state = {
      showSentKehus: false
    };
  }

  render() {
    const titleText = this.state.showSentKehus
      ? "Lähetetyt Kehut"
      : "Saadut Kehut";
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <div className="KehusPanel">
              <div className="KehusPanelHeader">
                <h1 className="KehusPanelHeader-title kehus-title-nw">
                  {titleText}
                </h1>
                <div className="KehusPanelHeader-toggle-container">
                  <span className="KehusPanelHeader-text">Vaihda näkymää</span>
                  {this.renderToggleButton()}
                  <a href="/api/v1/kehut/kehu-raportti.xlsx">
                    <img
                      src="/images/excel-icon.svg"
                      className="KehusPanelHeader-download-report"
                    />
                  </a>
                </div>
              </div>
              {this.renderErrors()}
              {this.renderSelectedKehusTable()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderToggleButton() {
    const buttonText = this.state.showSentKehus
      ? "Saadut Kehut"
      : "Lähetetyt Kehut";
    return (
      <button
        className="Button KehusPanelHeader-button toggle-view-nw"
        onClick={this.toggleKehusView}
      >
        {buttonText}
      </button>
    );
  }

  toggleKehusView = ev => {
    ev.target.blur();
    this.setState(state => ({ showSentKehus: !state.showSentKehus }));
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
  roles: state.profile.roles,
  sentKehus: state.kehu.sentKehus
});

export default connect(
  mapStateToProps,
  null
)(KehusPanel);
