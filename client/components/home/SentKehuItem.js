import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

export class SentKehuItem extends Component {
  static propTypes = {
    kehu: PropTypes.object.isRequired,
    roles: PropTypes.array.isRequired
  };

  render() {
    const { kehu } = this.props;
    return (
      <div className="FeedItem">
        <img
          src={kehu.picture}
          className="FeedItem-image"
          alt={kehu.giver_name}
        />
        <span className="FeedItem-date">
          {moment(kehu.date_given).format("D.M.YYYY")}
        </span>
        <p className="FeedItem-text">{kehu.text}</p>
        <p className="FeedItem-info">{this.createInfo(kehu)}</p>
      </div>
    );
  }

  createInfo(kehu) {
    let text = "Lähetetty kehu: ";

    if (kehu.role_id) {
      const role = this.props.roles.find(r => r.id === kehu.role_id);
      text += `${kehu.giver_name}, ${role.role}`;
    } else {
      text += kehu.giver_name;
    }

    return text;
  }
}

const mapStateToProps = state => ({
  roles: state.profile.roles
});

export default connect(
  mapStateToProps,
  null
)(SentKehuItem);
