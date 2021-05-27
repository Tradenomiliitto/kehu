import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { selectSentKehu } from "../../redux/report";
import { truncateText } from "../../util/TextUtil";
import Checkbox from "../report/Checkbox";

export class SentKehuRow extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    roles: PropTypes.array.isRequired,
    isKehuSelection: PropTypes.bool,
    unselectedSentKehus: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  render() {
    const { kehu } = this.props;
    const { open } = this.state;
    const text = open ? kehu.text : truncateText(kehu.text, 200);
    return (
      <tr className="KehusTable-row kehu-row-nw" onClick={this.toggleState}>
        {this.props.isKehuSelection ? (
          <td>
            <Checkbox
              name={String(kehu.id)}
              checked={!this.props.unselectedSentKehus.has(String(kehu.id))}
              onChange={this.handeSelectKehuClick}
            />
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
    const role = roles.find((role) => role.id === kehu.role_id);
    if (role) {
      return role.role;
    }
  }

  toggleState = () => {
    this.setState((state) => ({ open: !state.open }));
  };

  handeSelectKehuClick = (ev) => {
    ev.stopPropagation();
    const id = ev.target.name;
    const isChecked = ev.target.checked;
    this.props.selectSentKehu(id, isChecked);
  };
}

const mapStateToProps = (state) => ({
  unselectedSentKehus: state.report.unselectedSentKehus,
  profile: state.profile.profile,
});

export default connect(mapStateToProps, { selectSentKehu })(SentKehuRow);
