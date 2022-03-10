import React, { Component } from "react";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { Provider, connect } from "react-redux";
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
import { getGroups } from "./redux/group";
import ClaimKehuPanel from "./ClaimKehuPanel";
import KehusPanel from "./KehusPanel";
import ProfilePanel from "./ProfilePanel";
import ReportPanel from "./ReportPanel";
import GroupsPanel from "./GroupsPanel";
import Spinner from "./components/Spinner";
import { handlePageView } from "./util/AnalyticsUtil";
import { supportedLanguages } from "./i18n";

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
    kehuToEdit: PropTypes.object,
    groupsLoading: PropTypes.bool.isRequired,
    groupsLoaded: PropTypes.bool.isRequired,
    groupsError: PropTypes.object,
    getGroups: PropTypes.func.isRequired,
    // i18n props coming from withTranslation()
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    tReady: PropTypes.bool,
  };

  state = {
    loading: true,
    loadingProfile: false,
    loadingKehus: false,
  };

  componentDidMount() {
    this.loadProfileAndKehusAndGroups();
  }

  componentDidUpdate() {
    this.loadProfileAndKehusAndGroups();
  }

  loadProfileAndKehusAndGroups() {
    const { groupsLoaded, groupsLoading, groupsError } = this.props;
    if (!groupsLoaded && !groupsLoading && !groupsError) {
      this.props.getGroups();
    }

    // Load profile and kehus only after translations are ready
    if (!this.props.tReady) return;

    if (!this.props.profileLoaded) {
      if (!this.state.loadingProfile) {
        this.props.getProfile();
        this.setState({ loadingProfile: true });
      }
    } else {
      if (this.state.loadingProfile) this.setState({ loadingProfile: false });
    }

    if (!this.props.kehusLoaded) {
      if (!this.state.loadingKehus) {
        this.props.getKehus();
        this.setState({ loadingKehus: true });
      }
    } else {
      if (this.state.loadingKehus) this.setState({ loadingKehus: false });
    }

    if (
      this.props.profileLoaded &&
      this.props.kehusLoaded &&
      this.props.groupsLoaded &&
      this.state.loading
    ) {
      this.setState({ loading: false });
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
    // TODO: Show proper error message and send email to web admin
    if (!this.props.groupsLoaded && this.props.groupsError) {
      return (
        <>
          Virhe yhteisöiden latauksessa:{" "}
          {this.props.groupsError.responseJson?.message}
        </>
      );
    }

    if (this.state.loading) {
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
            <Route exact path={`${lng}/yhteisot`} component={GroupsPanel} />
            <Route
              render={(props) =>
                lngRedirect(this.props.i18n.language, props.location.pathname)
              }
            />
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
    const { t } = this.props;
    if (this.props.successfullySavedKehu) {
      return (
        <KehuFormModal
          title={t(
            "modals.add-kehu.title-successfully-saved",
            "Kehu tallennettu!"
          )}
        >
          <KehuSuccessPanel kehu={this.props.successfullySavedKehu} />
        </KehuFormModal>
      );
    }
    if (this.props.kehuToEdit) {
      return (
        <KehuFormModal
          title={t("modals.add-kehu.title-edit-kehu", "Muokkaa Kehua")}
        >
          <AddKehuForm kehu={this.props.kehuToEdit} />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title={t("modals.add-kehu.title-add-kehu", "Lisää Kehu")}>
        <AddKehuForm />
      </KehuFormModal>
    );
  }

  renderSendKehuContent() {
    const { t } = this.props;
    if (this.props.successfullySentKehu) {
      return (
        <KehuFormModal title="">
          <SendKehuSuccessPanel />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title={t("modals.send-kehu.title", "Lähetä Kehu")}>
        <SendKehuForm />
      </KehuFormModal>
    );
  }
}

const mapStateToProps = (state) => ({
  isAddKehuPortalVisible: state.portal.addKehuPortalVisible,
  isSendKehuPortalVisible: state.portal.sendKehuPortalVisible,
  successfullySavedKehu: state.kehu.savedKehu,
  successfullySentKehu: state.kehu.sendKehuSuccess,
  kehusLoaded: state.kehu.kehusLoaded,
  profileLoaded: state.profile.profileLoaded,
  kehuToEdit: state.portal.kehu,
  groupsLoading: state.group.loading,
  groupsLoaded: state.group.groupsLoaded,
  groupsError: state.group.error,
});

const mapDispatchToProps = {
  getProfile,
  getKehus,
  getGroups,
};

const AppContainer = compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(App);

export default function ProviderApp() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

function lngRedirect(currentLng, pathname) {
  // Get language from path, e.g. '/fi/kehut' --> pathLng === 'fi'
  const pathLng = pathname.split("/")[1];

  // Language is correct but because none of the earlier Routes caught this the
  // route is unknown. Express renders 404 page for invalid urls so user entered
  // url shouldn't end up here --> Only way to get here is invalid react-router
  // redirect
  if (currentLng === pathLng) {
    return <Redirect to="/" />;
  }

  // Url has valid language but it's different than current language. Replace
  // language with current current language and redirect
  if (supportedLanguages.includes(pathLng)) {
    return <Redirect to={pathname.replace(pathLng, currentLng)} />;
  }

  // Url has no valid language prefix --> add current language and keep rest of
  // the path (this redirect is used e.g. when adding a kehu from email)
  return <Redirect to={"/" + currentLng + pathname} />;
}
