import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "./redux";
import Home from "./Home";
import Header from "./components/Header";
import Portal from "./components/Portal";
import KehuFormModal from "./components/KehuFormModal";
import AddKehuForm from "./components/AddKehuForm";
import { getProfile } from "./redux/user";

class App extends Component {
  static propTypes = {
    isPortalVisible: PropTypes.bool.isRequired,
    getProfile: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getProfile();
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Header />
          <Home />
          {this.renderPortal()}
        </div>
      </Provider>
    );
  }

  renderPortal() {
    if (this.props.isPortalVisible) {
      return (
        <Portal>
          <KehuFormModal title="Lisää Kehu">
            <AddKehuForm />
          </KehuFormModal>
        </Portal>
      );
    }
  }
}

const mapStateToProps = state => ({
  isPortalVisible: state.portal.isVisible
});

const mapDispatchToProps = {
  getProfile
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);
