import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";
import PropTypes from "prop-types";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import store from "./redux";
import HomePanel from "./HomePanel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Portal from "./components/Portal";
import KehuFormModal from "./components/KehuFormModal";
import AddKehuForm from "./components/kehuform/AddKehuForm";
import SendKehuForm from "./components/kehuform/SendKehuForm";
import KehuSuccessPanel from "./components/kehuform/KehuSuccessPanel";
import SendKehuSuccessPanel from "./components/kehuform/SendKehuSuccessPanel";
import { getProfile } from "./redux/profile";
import { getKehus } from "./redux/kehu";
import ClaimKehuPanel from "./ClaimKehuPanel";
import KehusPanel from "./KehusPanel";
import ProfilePanel from "./ProfilePanel";
import ReportPanel from "./ReportPanel";
import Spinner from "./components/Spinner";
import { handlePageView } from "./util/AnalyticsUtil";
import { compose } from "redux";
import { withTranslation } from "react-i18next";

const history = createBrowserHistory();
history.listen(handlePageView);

export class App extends Component {
  static propTypes = {
    isAddKehuPortalVisible: PropTypes.bool.isRequired,
    isSendKehuPortalVisible: PropTypes.bool.isRequired,
    profileLoaded: PropTypes.bool.isRequired,
    kehusLoaded: PropTypes.bool.isRequired,
    successfullySavedKehu: PropTypes.object,
    successfullySentKehu: PropTypes.bool,
    getProfile: PropTypes.func.isRequired,
    getKehus: PropTypes.func.isRequired,
    kehuToEdit: PropTypes.object
  };

  componentDidMount() {
    if (!this.props.profileLoaded) {
      this.props.getProfile();
    }
    if (!this.props.kehusLoaded) {
      this.props.getKehus();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>{this.defineContent()}</Router>
      </Provider>
    );
  }

  defineContent() {
    if (
      !this.props.profileLoaded ||
      !this.props.kehusLoaded ||
      !this.props.tReady
    ) {
      return <Spinner />;
    }

    const lng = "/" + this.props.i18n.language;

    return (
      <div className="App">
        <Header />
        <div className="Content">
          <Switch>
            <Route exact path={`${lng}/`} component={HomePanel} />
            <Route
              exact
              path={`${lng}/kehut/lisaa/:claim_id`}
              component={ClaimKehuPanel}
            />
            <Route exact path={`${lng}/kehut`} component={KehusPanel} />
            <Route exact path={`${lng}/profiili`} component={ProfilePanel} />
            <Route exact path={`${lng}/raportit`} component={ReportPanel} />
            <Route
              path="/:lang/*"
              render={props => lngRedirect(lng, props.match)}
            />
            <Redirect to={lng} />
          </Switch>
          {this.renderPortal()}
        </div>
        <Footer />
      </div>
    );
  }

  renderPortal() {
    if (this.props.isAddKehuPortalVisible) {
      return <Portal>{this.renderAddKehuContent()}</Portal>;
    } else if (this.props.isSendKehuPortalVisible) {
      return <Portal>{this.renderSendKehuContent()}</Portal>;
    }
  }

  renderAddKehuContent() {
    if (this.props.successfullySavedKehu) {
      return (
        <KehuFormModal title="Kehu tallennettu!">
          <KehuSuccessPanel kehu={this.props.successfullySavedKehu} />
        </KehuFormModal>
      );
    }
    if (this.props.kehuToEdit) {
      return (
        <KehuFormModal title="Muokkaa Kehua">
          <AddKehuForm kehu={this.props.kehuToEdit} />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title="Lisää Kehu">
        <AddKehuForm />
      </KehuFormModal>
    );
  }

  renderSendKehuContent() {
    if (this.props.successfullySentKehu) {
      return (
        <KehuFormModal title="">
          <SendKehuSuccessPanel />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title="Lähetä Kehu">
        <SendKehuForm />
      </KehuFormModal>
    );
  }
}

const mapStateToProps = state => ({
  isAddKehuPortalVisible: state.portal.addKehuPortalVisible,
  isSendKehuPortalVisible: state.portal.sendKehuPortalVisible,
  successfullySavedKehu: state.kehu.savedKehu,
  successfullySentKehu: state.kehu.sendKehuSuccess,
  kehusLoaded: state.kehu.kehusLoaded,
  profileLoaded: state.profile.profileLoaded,
  kehuToEdit: state.portal.kehu
});

const mapDispatchToProps = {
  getProfile,
  getKehus
};

const AppContainer = compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);

const HotApp = hot(module)(AppContainer);

export default () => (
  <Provider store={store}>
    <HotApp />
  </Provider>
);

function lngRedirect(language, match) {
  // match.params[0] contains the url after language prefix
  return <Redirect to={language + "/" + match.params[0]} />;
}
