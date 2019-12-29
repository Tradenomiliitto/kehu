import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import KehusTable from "../kehus/KehusTable";
import SentKehusTable from "../kehus/SentKehusTable";
import ErrorPanel from "../ErrorPanel";

export class KehusPanel extends Component {
  static propTypes = {
    error: PropTypes.object,
    kehus: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    sentKehus: PropTypes.array
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12">
            <div className="KehusPanel">{this.renderSelectedKehusTable()}</div>
          </div>
        </div>
      </div>
    );
  }

  renderSelectedKehusTable() {
    return (
      <div>
        Lähetetyt kehut
        <SentKehusTable
          kehus={this.props.sentKehus}
          roles={this.props.roles}
          isKehuSelection={true}
        />
        Saadut kehut
        <KehusTable kehus={this.props.kehus} isKehuSelection={true} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  kehus: state.kehu.kehus,
  roles: state.profile.roles,
  sentKehus: state.kehu.sentKehus
});

export default connect(
  mapStateToProps,
  null
)(KehusPanel);
