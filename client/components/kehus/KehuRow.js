import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import KehusTableActionButton from "./KehusTableActionButton";

export default class KehuRow extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired
  };

  render() {
    const { kehu } = this.props;
    return (
      <tr className="KehusTable-row">
        <td>{moment(kehu.date_given).format("D.M.YYYY")}</td>
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
    return <span className="KehusTable-item">{tag.text}</span>;
  }

  handleEditClick = () => {
    console.log("edit");
  };

  handleRemoveClick = () => {
    console.log("remove");
  };
}
