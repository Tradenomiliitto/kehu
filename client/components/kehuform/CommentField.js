import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

export default class CommentField extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  render() {
    const { value, handleChange } = this.props;
    const classNames = cn({
      CommentField: true,
      "CommentField--open": this.state.open
    });
    const icon = this.state.open ? "secondary" : "gray";

    return (
      <div className={classNames}>
        <textarea
          id="comment"
          className="CommentField-textarea"
          name="text"
          rows={5}
          placeholder="Omat kommentit"
          value={value}
          onChange={handleChange}
        />
        <button className="CommentField-button" onClick={this.handleClick}>
          <img
            src={`/images/icon-plus-${icon}.svg`}
            className="CommentField-plusSign"
          />
          <span className="CommentField-buttonText">Omat kommentit</span>
        </button>
      </div>
    );
  }

  handleClick = ev => {
    ev.preventDefault();
    this.setState(state => ({ open: !state.open }));
  };
}
