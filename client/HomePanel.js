import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleAddKehuFormModal } from "./redux/portal";

class HomePanel extends Component {
  static propTypes = {
    toggleAddKehuFormModal: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 HomeButtons home-nw">
            <button
              className="Button Button--wide add-kehu-nw"
              onClick={this.props.toggleAddKehuFormModal}
            >
              Lisää Kehu
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {
    toggleAddKehuFormModal
  }
)(HomePanel);
