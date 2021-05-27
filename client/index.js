import "./scss/app-style.scss";
import "@babel/polyfill";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import "./i18n";

ReactDOM.render(<App />, document.getElementById("app"));
