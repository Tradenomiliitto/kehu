import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { compose } from "redux";
import KehusTable from "./components/kehus/KehusTable";
import SentKehusTable from "./components/kehus/SentKehusTable";
import ErrorPanel from "./components/ErrorPanel";
import { kehuPropType, sentKehuPropType } from "./util/PropTypes";

export class KehusPanel extends Component {
  static propTypes = {
    error: PropTypes.object,
    kehus: PropTypes.arrayOf(kehuPropType).isRequired,
    sentKehus: PropTypes.arrayOf(sentKehuPropType).isRequired,
    roles: PropTypes.array.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    // react-router-dom
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  };

  constructor() {
    super();
    this.state = {
      showSentKehus: false,
    };
  }

  componentDidMount() {
    if (this.props.location.search === "?sent") {
      this.setState(() => ({ showSentKehus: true }));
      this.props.history.push({
        search: null,
      });
    }
  }

  render() {
    const { t, i18n } = this.props;
    const titleText = this.state.showSentKehus
      ? t("kehus.title-sent-kehus", "Lähetetyt Kehut")
      : t("kehus.title-received-kehus", "Saadut Kehut");
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
                  <span className="KehusPanelHeader-text">
                    {t("kehus.toggle-view", "Vaihda näkymää")}
                  </span>
                  {this.renderToggleButton()}
                  <a href={"/api/v1/kehut/report?lng=" + i18n.language}>
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
    const { t } = this.props;
    const buttonText = this.state.showSentKehus
      ? t("kehus.received-kehus-btn", "Saadut Kehut")
      : t("kehus.sent-kehus-btn", "Lähetetyt Kehut");
    return (
      <button
        className="Button KehusPanelHeader-button toggle-view-nw"
        onClick={this.toggleKehusView}
      >
        {buttonText}
      </button>
    );
  }

  toggleKehusView = (ev) => {
    ev.target.blur();
    this.setState((state) => ({ showSentKehus: !state.showSentKehus }));
  };

  renderErrors() {
    const { t, error } = this.props;
    if (error && error.message) {
      const message = t("kehus.remove-kehu-error", {
        error: error.message,
        defaultValue:
          "Valitettavasti Kehun poistaminen epäonnistui. Seuraava virhe tapahtui: {{error}}",
      });
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

const mapStateToProps = (state) => ({
  kehus: state.kehu.kehus,
  sentKehus: state.kehu.sentKehus,
  error: state.kehu.removeKehuError,
  roles: state.profile.roles,
});

export default compose(
  withTranslation(),
  connect(mapStateToProps, null)
)(KehusPanel);
