import React, { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import store from "./redux";
import Home from "./Home";
import Header from "./components/Header";
import Portal from "./components/Portal";

class App extends Component {
  static propTypes = {
    isPortalVisible: PropTypes.bool.isRequired
  };

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
      return <Portal>HELLO!</Portal>;
    }
  }
}

const mapStateToProps = state => ({
  isPortalVisible: state.portal.isVisible
});

const AppContainer = connect(
  mapStateToProps,
  null
)(App);

export default () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);
