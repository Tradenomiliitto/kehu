import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LangLink as Link } from "./util/LangLink";
import { claimKehu } from "./redux/kehu";
import Spinner from "./components/Spinner";
import ErrorPanel from "./components/ErrorPanel";

export class ClaimKehuPanel extends Component {
  static propTypes = {
    isKehuClaimed: PropTypes.bool.isRequired,
    claimKehu: PropTypes.func.isRequired,
    error: PropTypes.object,
    match: PropTypes.shape({
      params: PropTypes.shape({
        claim_id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  componentDidMount() {
    this.props.claimKehu(this.props.match.params.claim_id);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col col-xs-12 col-md-6 col-md-offset-3">
            {this.renderContent()}
          </div>
        </div>
      </div>
    );
  }

  renderContent() {
    if (this.props.error) {
      return (
        <ErrorPanel message="Kehun lisäämisessä tapahtui virhe tai se on jo lisätty. Yritä myöhemmin uudelleen." />
      );
    }

    if (!this.props.isKehuClaimed) {
      return <Spinner />;
    }

    return (
      <div className="ClaimKehuSuccess success-js">
        <div className="SuccessMark">
          <span>&#10004;</span>
        </div>

        <p>Kehu lisätty onnistuneesti!</p>
        <LangLink to="/kehut" className="Button Button--inverseNoBorders">
          Näytä Kehut
        </LangLink>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isKehuClaimed: !!state.kehu.claimKehuSuccess,
  error: state.kehu.error
});

const mapActionsToProps = {
  claimKehu
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ClaimKehuPanel);
