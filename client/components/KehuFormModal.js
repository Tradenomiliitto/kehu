import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetKehuFormState } from "../redux/kehu";

export class KehuFormModal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    resetKehuFormState: PropTypes.func.isRequired,
    closeModal: PropTypes.func
  };

  render() {
    return (
      <div className="Modal">
        <div className="Modal-overlay">
          <div className="Modal-content">
            <div className="Modal-header">
              <button
                className="Modal-closeButton modal-close-nw close-button-js"
                onClick={this.handleClick}
              >
                &#10005;
              </button>
              <h3 className="Modal-title modal-title-js modal-title-nw">
                {this.props.title}
              </h3>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  handleClick = () => {
    if (this.props.closeModal) {
      this.props.closeModal();
    } else {
      this.props.resetKehuFormState();
    }
  };
}

export default connect(
  null,
  { resetKehuFormState }
)(KehuFormModal);
