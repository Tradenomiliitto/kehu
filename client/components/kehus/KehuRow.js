import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import KehusTableActionButton from "./KehusTableActionButton";
import { removeKehu } from "../../redux/kehu";
import { openEditKehuModal } from "../../redux/portal";
import { truncateText } from "../../util/TextUtil";

export class KehuRow extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    removeKehu: PropTypes.func.isRequired,
    openEditKehuModal: PropTypes.func.isRequired
  };

  render() {
    const { kehu } = this.props;
    return (
      <tr className="KehusTable-row kehu-row-nw">
        <td>{moment(kehu.date_given).format("D.M.YYYY")}</td>
        <td>{kehu.role && kehu.role.role}</td>
        <td>{kehu.giver_name}</td>
        <td className="KehusTable-cell--text">
          {truncateText(kehu.text, 200)}
        </td>
        <td>
          <div className="KehusTable-cell--tags">
            {kehu.situations.map(this.renderItem)}
          </div>
        </td>
        <td>
          <div className="KehusTable-cell--tags">
            {kehu.tags.map(this.renderItem)}
          </div>
        </td>
        <td>{this.renderStars()}</td>
        <td>{this.renderComment()}</td>
        <td>
          <KehusTableActionButton
            icon="edit-black"
            onClick={this.handleEditClick}
          />
        </td>
        <td>
          <KehusTableActionButton
            icon="trash-red"
            onClick={this.handleRemoveClick}
          />
        </td>
      </tr>
    );
  }

  renderItem(tag) {
    return (
      <span key={tag.text} className="KehusTable-item">
        {tag.text}
      </span>
    );
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
          className="KehusTable-star"
        />
      );
    }

    return stars;
  }

  renderComment() {
    const { kehu } = this.props;
    if (kehu.comment) {
      return <KehusTableActionButton icon="comment-black" onClick={() => {}} />;
    } else {
      return "\u00A0";
    }
  }

  handleEditClick = () => {
    this.props.openEditKehuModal(this.props.kehu);
  };

  handleRemoveClick = () => {
    const {
      kehu: { id },
      removeKehu
    } = this.props;
    if (confirm("Haluatko varmasti poistaa Kehun?")) {
      removeKehu(id);
    }
  };
}

export default connect(
  null,
  {
    removeKehu,
    openEditKehuModal
  }
)(KehuRow);
