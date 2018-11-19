import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import store from "./redux";
import Home from "./Home";
import Header from "./components/Header";
import Portal from "./components/Portal";
import KehuFormModal from "./components/KehuFormModal";
import AddKehuForm from "./components/kehuform/KehuForm";
import AddKehuSuccessPanel from "./components/kehuform/KehuSuccessPanel";
import { getProfile } from "./redux/profile";
import KehusPanel from "./KehusPanel";
import Spinner from "./components/Spinner";

export class App extends Component {
  static propTypes = {
    isPortalVisible: PropTypes.bool.isRequired,
    profileLoaded: PropTypes.bool.isRequired,
    successfullyAddedKehu: PropTypes.object,
    getProfile: PropTypes.func.isRequired
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
          <Route exact path="/" component={Home} />
          <Route exact path="/kehut" component={KehusPanel} />
        </Switch>
        {this.renderPortal()}
      </div>
    );
  }

  renderPortal() {
    if (this.props.isPortalVisible) {
      return <Portal>{this.renderAddKehuForm()}</Portal>;
    }
  }

  renderAddKehuForm() {
    if (this.props.successfullyAddedKehu) {
      return (
        <KehuFormModal title="Kehu lisätty!">
          <AddKehuSuccessPanel kehu={this.props.successfullyAddedKehu} />
        </KehuFormModal>
      );
    }
    return (
      <KehuFormModal title="Lisää Kehu">
        <AddKehuForm />
      </KehuFormModal>
    );
  }
}

const mapStateToProps = state => ({
  isPortalVisible: state.portal.portalVisible,
  successfullyAddedKehu: state.kehu.addedKehu,
  profileLoaded: state.profile.profileLoaded
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
