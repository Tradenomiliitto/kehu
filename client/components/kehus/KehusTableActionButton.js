import React, { Component } from "react";
import PropTypes from "prop-types";

export default class KehusTableActionButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { icon, onClick } = this.props;
    return (
      <button className={`KehusTableActionButton ${icon}-nw`} onClick={onClick}>
        <img
          src={`/images/icon-${icon}.png`}
          className="KehusTableActionButton-image"
        />
      </button>
    );
  }
}
