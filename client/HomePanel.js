import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  toggleAddKehuFormModal,
  toggleSendKehuFormModal
} from "./redux/portal";

export class HomePanel extends Component {
  static propTypes = {
    history: PropTypes.shape({
      location: PropTypes.shape({
        search: PropTypes.string
      }).isRequired,
      replace: PropTypes.func.isRequired
    }).isRequired,
    toggleAddKehuFormModal: PropTypes.func.isRequired,
    toggleSendKehuFormModal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.checkAndOpenModal();
  }

  render() {
    return (
      <div className="Home home-nw">
        <div className="container">
          <div className="row">
            <div className="col col-xs-12 col-md-9">
              <div className="row HomeButtons">
                <div className="col col-xs-12 col-md-8">
                  <h1 className="HomeButtons-title">Lisää uusi Kehu</h1>
                  <p className="HomeButtons-text">
                    Älä pidä kehujasi vakan alla! Tallenna Kehu-pankkiisi
                    kuulemasi kehu tai pristä kollegaa lähettämällä Kehu!
                  </p>
                </div>
                <div className="col col-xs-12 col-md-4">
                  <div className="HomeButtons-buttons">
                    <button
                      className="Button add-kehu-nw"
                      onClick={this.props.toggleAddKehuFormModal}
                    >
                      Lisää Kehu
                    </button>
                    <button
                      className="Button send-kehu-nw"
                      onClick={this.props.toggleSendKehuFormModal}
                    >
                      Lähetä Kehu
                    </button>
                  </div>
                </div>
              </div>
              {this.renderWelcomeElement()}
              <div className="col col-xs-12 col-md-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderWelcomeElement() {
    if (!this.props.hasKehus) {
      return (
        <div className="row Welcome">
          <div className="col col-xs-12 col-md-4">
            <div className="Welcome-image">
              <img src="/images/kehu-thumbs-up.svg" alt="Tervetuloa" />
            </div>
          </div>
          <div className="col col-xs-12 col-md-8">
            <h2 className="Welcome-title">Tervetuloa Kehuun!</h2>
            <p className="Welcome-text">Mahtavaa, että löysit tiesi Kehuun!</p>
            <p className="Welcome-text">
              Aloita Kehun käyttö lisäämällä uusi kehu - se voi olla jotain mitä
              sinulle on sanottu, kirjoitettu, annettu formaalina palautteena,
              tai minkä vain itse koet kehuksi.
            </p>
            <p className="Welcome-text">
              Aloita tiesi oman osaamisesi tilastoguruksi heti ja tallenna
              ensimmäinen kehusi!
            </p>
          </div>
        </div>
      );
    }
  }

  checkAndOpenModal() {
    const params = new URLSearchParams(this.props.history.location.search);
    if (params.has("q")) {
      if (params.get("q") === "lisaa") {
        this.props.toggleAddKehuFormModal();
      }
      if (params.get("q") === "laheta") {
        this.props.toggleSendKehuFormModal();
      }
      this.props.history.replace("/");
    }
  }
}

const mapStateToProps = state => ({
  hasKehus: state.report.numberOfKehus > 0
});

const mapActionsToProps = {
  toggleAddKehuFormModal,
  toggleSendKehuFormModal
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(HomePanel);
