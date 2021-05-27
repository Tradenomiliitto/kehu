import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ErrorPanel extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.element = React.createRef();
  }

  componentDidMount() {
    this.element.current.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const { message } = this.props;
    return (
      <div className="ErrorPanel error-nw" ref={this.element}>
        <p className="ErrorPanel-text">{message}</p>
      </div>
    );
  }
}
