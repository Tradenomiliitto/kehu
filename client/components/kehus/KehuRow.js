import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import KehusTableActionButton from "./KehusTableActionButton";
import { removeKehu } from "../../redux/kehu";
import { openEditKehuModal } from "../../redux/portal";

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
        <td className="KehusTable-cell--light">{kehu.text}</td>
        <td>{kehu.situations.map(this.renderItem)}</td>
        <td>{kehu.tags.map(this.renderItem)}</td>
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
