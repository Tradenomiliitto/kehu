import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleModal } from "../redux/portal";

class KehuFormModal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    toggleModal: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="Modal">
        <div className="Modal-overlay">
          <div className="Modal-content">
            <div className="Modal-header">
              <button
                className="Modal-closeButton"
                onClick={this.props.toggleModal}
              >
                &#10005;
              </button>
              <h3 className="Modal-title">{this.props.title}</h3>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { toggleModal }
)(KehuFormModal);
