import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toggleKehuFormModal } from "../redux/portal";

export class Header extends Component {
  static propTypes = {
    toggleKehuFormModal: PropTypes.func.isRequired
  };

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
              <Link to="/" onClick={this.closeMenu}>
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
                    <a href="#" onClick={this.openKehuFormModal}>
                      Lisää Kehu
                    </a>
                  </li>
                  {this.renderMenuItem("/raportit", "Raportit")}
                  {this.renderMenuItem("/kehut", "Kehut")}
                  {this.renderMenuItem("/profiili", "Profiili")}
                </menu>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  renderMenuItem(route, text) {
    return (
      <li className="Header-menuItem">
        <Link to={route} onClick={this.closeMenu}>
          {text}
        </Link>
      </li>
    );
  }

  openKehuFormModal = ev => {
    ev.preventDefault();
    this.props.toggleKehuFormModal();
    this.closeMenu();
  };

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };
}

export default connect(
  null,
  { toggleKehuFormModal }
)(Header);
