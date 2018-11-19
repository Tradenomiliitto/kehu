import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetKehuFormState } from "../redux/kehu";

export class KehuFormModal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    resetKehuFormState: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="Modal">
        <div className="Modal-overlay">
          <div className="Modal-content">
            <div className="Modal-header">
              <button
                className="Modal-closeButton close-button-js"
                onClick={this.handleClick}
              >
                &#10005;
              </button>
              <h3 className="Modal-title modal-title-js">{this.props.title}</h3>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  handleClick = () => {
    this.props.resetKehuFormState();
  };
}

export default connect(
  null,
  { resetKehuFormState }
)(KehuFormModal);
