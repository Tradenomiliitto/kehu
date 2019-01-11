import React, { Component } from "react";
import PropTypes from "prop-types";
import SentKehuRow from "./SentKehuRow";

export default class SentKehusTable extends Component {
  static propTypes = {
    kehus: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired
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
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.props.kehus.map((kehu, i) => (
      <SentKehuRow key={i} kehu={kehu} roles={this.props.roles} />
    ));
  }
}
