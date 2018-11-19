import React, { Component } from "react";
import PropTypes from "prop-types";

export default class KehusTableActionButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  render() {
    return (
      <button className="KehusTableActionButton" onClick={this.props.onClick}>
        <img
          src={`/images/icon-${this.props.icon}.png`}
          className="KehusTableActionButton-image"
        />
      </button>
    );
  }
}
