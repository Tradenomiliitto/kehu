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
      <table className="Table KehusTable KehusTable--sent">
        <thead className="KehusTable-head">
          <tr>
            {this.props.isKehuSelection ? <th>Näytä raportissa</th> : null}
            <th>Aika</th>
            <th>Kehuja</th>
            <th className="KehusTable-senderColumn">Vastaanottaja</th>
            <th className="KehusTable-kehuColumn">Kehu</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.props.kehus.map((kehu, i) => (
      <SentKehuRow
        key={i}
        kehu={kehu}
        roles={this.props.roles}
        isKehuSelection={this.props.isKehuSelection}
      />
    ));
  }
}
