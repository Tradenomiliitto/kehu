import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { truncateText } from "../../util/TextUtil";

export default class SentKehuRow extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    roles: PropTypes.array.isRequired
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
    return (
      <tr className="KehusTable-row kehu-row-nw" onClick={this.toggleState}>
        {this.props.selectKehus ? (
          <td>
            <input type="checkbox" />
          </td>
        ) : null}
        <td>{moment(kehu.date_given).format("D.M.YYYY")}</td>
        <td>{this.renderRoleName()}</td>
        <td className="receiver-nw">{kehu.receiver_name}</td>
        <td className="KehusTable-cell--text text-nw text-js">{text}</td>
      </tr>
    );
  }

  renderRoleName() {
    const { kehu, roles } = this.props;
    const role = roles.find(role => role.id === kehu.role_id);
    if (role) {
      return role.role;
    }
  }

  toggleState = () => {
    this.setState(state => ({ open: !state.open }));
  };
}
