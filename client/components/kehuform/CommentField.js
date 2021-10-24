import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import cn from "classnames";

export class CommentField extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  render() {
    const { t, value, handleChange } = this.props;
    const classNames = cn({
      CommentField: true,
      "CommentField--open": this.state.open,
    });
    const icon = this.state.open ? "secondary" : "gray";

    return (
      <div className={classNames}>
        <textarea
          id="comment"
          className="CommentField-textarea"
          name="text"
          rows={5}
          placeholder={t(
            "modals.add-kehu.comment-placeholder",
            "Omat kommentit"
          )}
          value={value}
          onChange={handleChange}
        />
        <button className="CommentField-button" onClick={this.handleClick}>
          <img
            src={`/images/icon-plus-${icon}.svg`}
            className="CommentField-plusSign"
          />
          <span className="CommentField-buttonText">
            {t("modals.add-kehu.comment-btn", "Omat kommentit")}
          </span>
        </button>
      </div>
    );
  }

  handleClick = (ev) => {
    ev.preventDefault();
    this.setState((state) => ({ open: !state.open }));
  };
}

export default withTranslation()(CommentField);
