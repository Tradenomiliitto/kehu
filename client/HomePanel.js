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
      <div className="HomeButtons home-nw">
        <div className="container">
          <div className="row">
            <div className="col col-xs-12 col-md-6">
              <button
                className="Button Button--wide add-kehu-nw"
                onClick={this.props.toggleAddKehuFormModal}
              >
                Lisää Kehu
              </button>
            </div>
            <div className="col col-xs-12 col-md-6">
              <button
                className="Button Button--wide send-kehu-nw"
                onClick={this.props.toggleSendKehuFormModal}
              >
                Lähetä Kehu
              </button>
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
