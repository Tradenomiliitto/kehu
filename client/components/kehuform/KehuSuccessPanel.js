import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { resetKehuFormState } from "../../redux/kehu";
import RoleImage from "./RoleImage";

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
          <RoleImage className="KehuDetails-image" id={kehu.role.id} />
          <span className="kehu-giver-name-nw">
            {kehu.giver_name}, {kehu.role.role.toLowerCase()}
          </span>
          <br />
          <span className="kehu-date-given-nw">
            {moment(kehu.date_given).format("D.M.YYYY")}
          </span>
        </p>
        <div className="KehuTags kehu-tags-nw">
          {this.renderTagsAndSituations()}
        </div>
        <div className="KehuStars">{this.renderStars()}</div>
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

  renderStars() {
    const {
      kehu: { importance }
    } = this.props;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const icon = i <= importance ? "primary" : "secondary";
      stars.push(
        <img
          key={i}
          src={`/images/icon-star-${icon}.png`}
          className="KehuStars-star"
        />
      );
    }

    return stars;
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
