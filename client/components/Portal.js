import { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("portal");

export default class Portal extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.style.height = "initial";
    document.body.style.overflow = "initial";
    document.documentElement.style.height = "initial";
    document.documentElement.style.overflow = "initial";
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
