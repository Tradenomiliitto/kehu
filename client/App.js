import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import store from "./redux";
import HomePanel from "./HomePanel";
import Header from "./components/Header";
import Portal from "./components/Portal";
import KehuFormModal from "./components/KehuFormModal";
import KehuForm from "./components/kehuform/KehuForm";
import KehuSuccessPanel from "./components/kehuform/KehuSuccessPanel";
import { getProfile } from "./redux/profile";
import KehusPanel from "./KehusPanel";
import ProfilePanel from "./ProfilePanel";
import Spinner from "./components/Spinner";

export class App extends Component {
  static propTypes = {
    isPortalVisible: PropTypes.bool.isRequired,
    profileLoaded: PropTypes.bool.isRequired,
    successfullySavedKehu: PropTypes.object,
    getProfile: PropTypes.func.isRequired,
    kehuToEdit: PropTypes.object
  };

  componentDidMount() {
    if (!this.props.profileLoaded) {
      this.props.getProfile();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>{this.defineContent()}</Router>
      </Provider>
    );
  }

  defineContent() {
    if (!this.props.profileLoaded) {
      return <Spinner />;
    }

    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={HomePanel} />
          <Route exact path="/kehut" component={KehusPanel} />
          <Route exact path="/profiili" component={ProfilePanel} />
        </Switch>
        {this.renderPortal()}
      </div>
    );
  }

  renderPortal() {
    if (this.props.isPortalVisible) {
      return <Portal>{this.renderPortalContent()}</Portal>;
    }
  }

  renderPortalContent() {
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
          <KehuForm kehu={this.props.kehuToEdit} />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title="Lisää Kehu">
        <KehuForm />
      </KehuFormModal>
    );
  }
}

const mapStateToProps = state => ({
  isPortalVisible: state.portal.portalVisible,
  successfullySavedKehu: state.kehu.savedKehu,
  profileLoaded: state.profile.profileLoaded,
  kehuToEdit: state.portal.kehu
});

const mapDispatchToProps = {
  getProfile
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const HotApp = hot(module)(AppContainer);

export default () => (
  <Provider store={store}>
    <HotApp />
  </Provider>
);
