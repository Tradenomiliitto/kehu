import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./redux";
import Header from "./Header";
import Home from "./Home";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Header />
          <Home />
        </div>
      </Provider>
    );
  }
}
