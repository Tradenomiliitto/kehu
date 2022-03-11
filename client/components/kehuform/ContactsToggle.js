import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

export default class ContactsToggle extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired,
    handleSelect: PropTypes.func.isRequired,
    // Props to optionally open and close contacts outside of toggle
    toggleContacts: PropTypes.func,
    isOpen: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  render() {
    const classNames = cn({
      Contacts: true,
      // Props will override the component internal state
      "Contacts--open": this.props.isOpen ?? this.state.open,
    });

    return (
      <Fragment>
        <button className="ContactsToggleButton" onClick={this.toggleContacts}>
          <img src="/images/icon-down-arrow.svg" />
        </button>
        <ul className={classNames}>{this.renderContacts()}</ul>
      </Fragment>
    );
  }

  renderContacts() {
    return this.props.contacts.map((contact, i) => (
      <li key={i}>
        <a
          href="#"
          className="Contacts-link"
          onClick={this.handleClick(contact.name, contact.email)}
        >
          {contact.name}
          {contact.email && ` - ${contact.email}`}
        </a>
      </li>
    ));
  }

  toggleContacts = (ev) => {
    ev.preventDefault();
    this.toggleState();
  };

  handleClick = (name, email) => {
    return (ev) => {
      ev.preventDefault();
      this.props.handleSelect(name, email);
      this.toggleState();
    };
  };

  toggleState = () => {
    this.setState((state) => ({ open: !state.open }));
    // Update external state if it is used
    if (this.props.toggleContacts) this.props.toggleContacts();
  };
}
