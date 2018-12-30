import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  toggleAddKehuFormModal,
  toggleSendKehuFormModal
} from "./redux/portal";

class HomePanel extends Component {
  static propTypes = {
    toggleAddKehuFormModal: PropTypes.func.isRequired,
    toggleSendKehuFormModal: PropTypes.func.isRequired
  };

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
}

export default connect(
  null,
  {
    toggleAddKehuFormModal,
    toggleSendKehuFormModal
  }
)(HomePanel);
