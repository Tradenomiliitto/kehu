import React, { Component } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      menuOpen: false
    };
  }

  render() {
    const menuClass = cn({
      "Header-menu": true,
      "Header-menu--open": this.state.menuOpen
    });

    return (
      <header className="Header">
        <div className="container">
          <div className="row">
            <div className="col col-md-12 col-lg-4">
              <Link to="/">
                <img src="/images/kehu-logo.png" className="Header-logo" />
              </Link>
              <button className="Header-menuButton" onClick={this.toggleMenu}>
                <img src="/images/icon-menu.png" />
              </button>
            </div>
            <div className="col col-md-12 col-lg-8">
              <div className="Header-menuContainer">
                <menu className={menuClass}>
                  <li className="Header-menuItem">
                    <Link to="/kehut">Kehut</Link>
                  </li>
                  <li className="Header-menuItem">
                    <Link to="/raportit">Raportit</Link>
                  </li>
                  <li className="Header-menuItem">
                    <Link to="/profiili">Profiili</Link>
                  </li>
                </menu>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };
}
