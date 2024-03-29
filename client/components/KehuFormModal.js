import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { resetKehuFormState } from "../redux/kehu";

export class KehuFormModal extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    resetKehuFormState: PropTypes.func.isRequired,
    hasCloseCross: PropTypes.bool,
    hasCloseButton: PropTypes.bool,
    closeModal: PropTypes.func,
    // i18n props
    t: PropTypes.func.isRequired,
    // Ref for programmable scrolling of the modal
    contentRef: PropTypes.object,
  };

  static defaultProps = {
    hasCloseCross: true,
    hasCloseButton: false,
  };

  render() {
    const { t, contentRef } = this.props;
    return (
      <div className="Modal">
        <div className="Modal-overlay">
          <div className="Modal-content" ref={contentRef}>
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
                  {t("modals.ready-btn", "Valmis")}
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

export default compose(
  withTranslation(),
  connect(null, { resetKehuFormState }),
)(KehuFormModal);
