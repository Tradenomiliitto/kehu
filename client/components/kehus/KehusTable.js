import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import KehuRow from "./KehuRow";

export class KehusTable extends Component {
  static propTypes = {
    kehus: PropTypes.array.isRequired
  };

  render() {
    const { t } = this.props;
    return (
      <table className="Table KehusTable">
        <thead className="KehusTable-head">
          <tr>
            {this.props.isKehuSelection ? (
              <th>{t("kehus.show-in-report", "Näytä raportissa")}</th>
            ) : null}
            <th>{t("kehus.table-columns.time", "Aika")}</th>
            <th>{t("kehus.table-columns.sender", "Kehuja")}</th>
            <th className="KehusTable-senderColumn">
              {t("kehus.table-columns.name", "Nimi")}
            </th>
            <th>{t("kehus.table-columns.kehu", "Kehu")}</th>
            <th>{t("kehus.table-columns.situation", "Tilanne")}</th>
            <th>{t("kehus.table-columns.skills", "Taidot")}</th>
            <th className="KehusTable-starColumn">{this.renderStars()}</th>
            <th>
              <img
                src="/images/icon-comment-secondary.png"
                className="KehusTableActionButton-image"
              />
            </th>
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

  renderStars() {
    return Array.from(Array(5).keys()).map(i => (
      <img
        key={i}
        src="/images/icon-star-secondary.png"
        className="KehusTable-star"
      />
    ));
  }

  renderRows() {
    return this.props.kehus.map(kehu => (
      <KehuRow
        key={kehu.id}
        kehu={kehu}
        isKehuSelection={this.props.isKehuSelection}
      />
    ));
  }
}

export default withTranslation()(KehusTable);
