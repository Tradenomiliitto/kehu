import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleAddKehuModal } from "./redux/portal";

class Home extends Component {
  static propTypes = {
    toggleAddKehuModal: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 HomeButtons">
            <button
              className="Button Button--wide"
              onClick={this.props.toggleAddKehuModal}
            >
              Lisää Kehu
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {
    toggleAddKehuModal
  }
)(Home);
