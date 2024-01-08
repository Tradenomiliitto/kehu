import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import SentKehuRow from "./SentKehuRow";

export class SentKehusTable extends Component {
  static propTypes = {
    kehus: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    // i18n props
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props;
    return (
      <table className="Table KehusTable KehusTable--sent">
        <thead className="KehusTable-head">
          <tr>
            {this.props.isKehuSelection ? (
              <th>{t("kehus.show-in-report", "Näytä raportissa")}</th>
            ) : null}
            <th>{t("kehus.table-columns.time", "Aika")}</th>
            <th>{t("kehus.table-columns.sender", "Kehuja")}</th>
            <th className="KehusTable-senderColumn">
              {t("kehus.table-columns.receiver", "Vastaanottaja")}
            </th>
            <th className="KehusTable-kehuColumn">
              {t("kehus.table-columns.kehu", "Kehu")}
            </th>
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

export default withTranslation()(SentKehusTable);
