import React, { Component } from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("portal");

export default class Portal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.style.height = "initial";
    document.body.style.overflow = "initial";
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
