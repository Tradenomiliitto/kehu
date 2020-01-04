import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetKehuFormState } from "../redux/kehu";

export class KehuFormModal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    resetKehuFormState: PropTypes.func.isRequired,
    hasCloseCross: PropTypes.bool,
    hasCloseButton: PropTypes.bool,
    closeModal: PropTypes.func
  };

  static defaultProps = {
    hasCloseCross: true,
    hasCloseButton: false
  };

  render() {
    return (
      <div className="Modal">
        <div className="Modal-overlay">
          <div className="Modal-content">
            <div className="Modal-header">
              {this.props.hasCloseCross && (
                <button
                  className="Modal-closeCross modal-close-nw close-button-js"
                  onClick={this.handleClick}
                >
                  &#10005;
                </button>
              )}
              <h3 className="Modal-title modal-title-js modal-title-nw">
                {this.props.title}
              </h3>
              {this.props.hasCloseButton && (
                <button
                  className="Button Modal-closeButton"
                  onClick={this.handleClick}
                >
                  Valmis
                </button>
              )}
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
