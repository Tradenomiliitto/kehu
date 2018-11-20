import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleKehuFormModal } from "./redux/portal";

class HomePanel extends Component {
  static propTypes = {
    toggleKehuFormModal: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 HomeButtons">
            <button
              className="Button Button--wide"
              onClick={this.props.toggleKehuFormModal}
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
    toggleKehuFormModal
  }
)(HomePanel);
