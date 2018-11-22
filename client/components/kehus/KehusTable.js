import React, { Component } from "react";
import PropTypes from "prop-types";
import KehuRow from "./KehuRow";

export default class KehusTable extends Component {
  static propTypes = {
    kehus: PropTypes.array.isRequired
  };

  render() {
    return (
      <table className="Table KehusTable">
        <thead className="KehusTable-head">
          <tr>
            <th>Aika</th>
            <th>Kehuja</th>
            <th>Nimi</th>
            <th>Kehu</th>
            <th>Tilanne</th>
            <th>Taidot</th>
            <th>
              <img
                src="/images/icon-edit-secondary.png"
                className="KehusTableActionButton-image"
              />
            </th>
            <th>
              <img
                src="/images/icon-trash-secondary.png"
                className="KehusTableActionButton-image"
              />
            </th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.props.kehus.map(kehu => <KehuRow key={kehu.id} kehu={kehu} />);
  }
}
