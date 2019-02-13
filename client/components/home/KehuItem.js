import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

export default class KehuItem extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired
  };

  render() {
    const { kehu } = this.props;
    return (
      <div className="FeedItem">
        <span className="FeedItem-date">
          {moment(kehu.date_given).format("D.M.YYYY")}
        </span>
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">{this.createInfo(kehu)}</p>
      </div>
    );
  }

  createInfo(kehu) {
    let text = "";

    if (kehu.receiver_email) {
      text += "Vastaanotettu kehu: ";
    }

    if (kehu.role && kehu.role.role) {
      text += `${kehu.giver_name}, ${kehu.role.role}`;
    } else {
      text += kehu.giver_name;
    }

    if (kehu.tags && kehu.tags.length) {
      text += `. Asiasanat: ${kehu.tags.map(t => t.text).join(", ")}`;
    }

    return text;
  }
}
