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
              <div className="row">
                <div className="col col-xs-12">
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
                  <div className="col col-xs-12" />
                </div>
              </div>
              <div className="col col-xs-12 col-md-3" />
            </div>
          </div>
        </div>
      </div>
    );
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

export default connect(
  null,
  {
    toggleAddKehuFormModal,
    toggleSendKehuFormModal
  }
)(HomePanel);
