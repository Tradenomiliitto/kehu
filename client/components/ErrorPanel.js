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

export function FormattedErrorPanel({ error, genericMessage }) {
  if (error?.responseJson?.errors) {
    return error.responseJson.errors.map((e, i) => (
      <ErrorPanel key={i} message={e.msg} />
    ));
  }

  if (error) {
    let errMessage = "";
    if (genericMessage) errMessage += genericMessage + ": ";
    errMessage += error.message;

    if (error.responseJson?.error)
      errMessage += ": " + error?.responseJson?.error;

    return <ErrorPanel message={errMessage} />;
  }

  return null;
}

FormattedErrorPanel.propTypes = {
  error: PropTypes.object,
  genericMessage: PropTypes.string,
};
