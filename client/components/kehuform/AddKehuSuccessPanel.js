import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { resetAddKehuState } from "../../redux/kehu";

export class AddKehuSuccessPanel extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    resetAddKehuState: PropTypes.func.isRequired
  };

  render() {
    const { kehu } = this.props;
    return (
      <div className="AddKehuSuccessPanel">
        <div className="AddKehuQuoteContainer">
          <p className="AddKehuQuote">{kehu.text}</p>
        </div>
        <p className="AddKehuDetails">
          {kehu.giver_name}
          <br />
          {moment(kehu.date_given).format("D.M.YYYY")}
        </p>
        <div className="AddKehuTags">{this.renderTagsAndSituations()}</div>
        <button
          className="Button Button--fullWidth AddKehuCloseButton"
          onClick={this.handleClick}
        >
          Sulje
        </button>
      </div>
    );
  }

  renderTagsAndSituations() {
    const {
      kehu: { tags, situations }
    } = this.props;
    return [...tags, ...situations].map((it, i) => {
      return (
        <span className="AddKehuItem" key={i}>
          {it.text}
        </span>
      );
    });
  }

  handleClick = () => {
    this.props.resetAddKehuState();
  };
}

const mapDispatchToProps = {
  resetAddKehuState
};

export default connect(
  null,
  mapDispatchToProps
)(AddKehuSuccessPanel);
