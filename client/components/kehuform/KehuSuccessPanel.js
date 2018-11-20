import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { resetKehuFormState } from "../../redux/kehu";

export class KehuSuccessPanel extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    toggleModal: PropTypes.func.isRequired,
    resetKehuFormState: PropTypes.func.isRequired
  };

  render() {
    const { kehu } = this.props;
    return (
      <div className="KehuSuccessPanel">
        <div className="KehuQuoteContainer">
          <p className="KehuQuote kehu-text-nw">{kehu.text}</p>
        </div>
        <p className="KehuDetails">
          <span className="kehu-giver-name-nw">{kehu.giver_name}</span>
          <br />
          <span className="kehu-date-given-nw">
            {moment(kehu.date_given).format("D.M.YYYY")}
          </span>
        </p>
        <div className="KehuTags kehu-tags-nw">
          {this.renderTagsAndSituations()}
        </div>
        <button
          className="Button Button--fullWidth KehuCloseButton close-button-nw"
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
        <span className="KehuItem" key={i}>
          {it.text}
        </span>
      );
    });
  }

  handleClick = () => {
    this.props.resetKehuFormState();
  };
}

const mapDispatchToProps = {
  resetKehuFormState
};

export default connect(
  null,
  mapDispatchToProps
)(KehuSuccessPanel);
