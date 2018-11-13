import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleModal } from "./redux/portal";

class Home extends Component {
  static propTypes = {
    toggleModal: PropTypes.func.required
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 HomeButtons">
            <button
              className="Button Button--wide"
              onClick={this.showAddKehuModal}
            >
              Lisää kehu
            </button>
          </div>
        </div>
      </div>
    );
  }

  showAddKehuModal = () => {
    this.props.toggleModal();
  };
}

export default connect(
  null,
  {
    toggleModal
  }
)(Home);
