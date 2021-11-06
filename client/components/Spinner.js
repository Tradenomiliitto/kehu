import React, { Component } from "react";
import PropTypes from "prop-types";
import MDSpinner from "react-md-spinner";

export default class Spinner extends Component {
  static propTypes = {
    options: PropTypes.object,
    customClassName: PropTypes.string,
  };

  render() {
    const defaultOptions = {
      size: 80,
      color1: "#ff96ac",
      color2: "#3b5f5f",
      color3: "#ff96ac",
      color4: "#3b5f5f",
    };
    const props = Object.assign({}, defaultOptions, this.props.options);
    return (
      <div className={this.props.customClassName ?? "Spinner"}>
        <MDSpinner {...props} />
      </div>
    );
  }
}
