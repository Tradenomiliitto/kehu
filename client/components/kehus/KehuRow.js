import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import cn from "classnames";
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

  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  render() {
    const { kehu } = this.props;
    const { open } = this.state;
    const text = open ? kehu.text : truncateText(kehu.text, 200);
    const tagsClasses = cn({
      "KehusTable-cell--tags": true,
      "KehusTable-cell--tagsOpen": open
    });
    return (
      <tr className="KehusTable-row kehu-row-nw" onClick={this.toggleState}>
        <td>{moment(kehu.date_given).format("D.M.YYYY")}</td>
        <td>{kehu.role && kehu.role.role}</td>
        <td>{kehu.giver_name}</td>
        <td className="KehusTable-cell--text text-js">{text}</td>
        <td>
          <div className={tagsClasses}>
            {kehu.situations.map(this.renderItem)}
          </div>
        </td>
        <td>
          <div className={tagsClasses}>{kehu.tags.map(this.renderItem)}</div>
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

  toggleState = () => {
    this.setState({ open: !this.state.open });
  };

  handleEditClick = ev => {
    ev.stopPropagation();
    this.props.openEditKehuModal(this.props.kehu);
  };

  handleRemoveClick = ev => {
    ev.stopPropagation();
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
