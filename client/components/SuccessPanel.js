import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SuccessPanel extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    hideAfter: PropTypes.number
  };

  constructor() {
    super();
    this.state = {
      hidden: false
    };
  }

  componentDidMount() {
    if (this.props.hideAfter) {
      setTimeout(() => {
        this.setState({ hidden: true });
      }, this.props.hideAfter);
    }
  }

  render() {
    const { message } = this.props;
    const { hidden } = this.state;

    if (hidden) {
      return null;
    }

    return (
      <div className="SuccessPanel error-nw">
        <p className="SuccessPanel-text">{message}</p>
      </div>
    );
  }
}
