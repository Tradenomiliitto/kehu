import React, { Component, Fragment } from "react";
import { withTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";
import cn from "classnames";

export class TopRolesPanel extends Component {
  static propTypes = {
    roles: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      animate: false
    };
    this.MAX_COUNT = this.calculateMaxHeight(this.props.roles);
  }

  calculateMaxHeight(roles) {
    if (roles[0]) {
      return Math.ceil(roles[0].count + roles[0].count * 0.1);
    }
    return 10;
  }

  calculateColumnHeight(role) {
    return `${(role.count / this.MAX_COUNT) * 100}%`;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ animate: true });
    }, 0);
  }

  render() {
    const { t } = this.props;
    return (
      <div className="ReportElement TopRoles">
        <p className="TopRoles-title">
          {t("report.top-roles-title", "TOP Kehujat")}
        </p>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { t } = this.props;
    if (!this.props.roles.length) {
      return (
        <Fragment>
          <Trans i18nKey="report.top-roles-no-data-notice">
            <p className="TopRoles-notice">
              Ei tarpeeksi tietoa TOP Kehujien näyttämiseksi.
            </p>
            <p className="TopRoles-notice">
              Lisää kehu tai merkitse roolit olemassa oleviin kehuihin.
            </p>
          </Trans>
        </Fragment>
      );
    }

    return (
      <div className="TopRoles-container">
        <div className="TopRoles-counts">
          <span className="TopRoles-count TopRoles-max">{this.MAX_COUNT}</span>
          {this.renderMiddleRoleCounts()}
          <span className="TopRoles-count TopRoles-min">0</span>
        </div>
        {this.renderRoles()}
      </div>
    );
  }

  renderMiddleRoleCounts() {
    if (this.MAX_COUNT % 3 === 0) {
      return (
        <Fragment>
          <span className="TopRoles-count TopRoles-twothirds">
            {(this.MAX_COUNT / 3) * 2}
          </span>
          <span className="TopRoles-count TopRoles-onethird">
            {this.MAX_COUNT / 3}
          </span>
        </Fragment>
      );
    }

    if (this.MAX_COUNT % 2 === 0) {
      return (
        <span className="TopRoles-count TopRoles-half">
          {Math.floor(this.MAX_COUNT / 2)}
        </span>
      );
    }
  }

  renderRoles() {
    const columnWidth = `${100 / this.props.roles.length}%`;
    const classNames = cn({
      "TopRole-column": true,
      "TopRole-column--animate": this.state.animate
    });
    return this.props.roles.map(role => {
      return (
        <div key={role.role} className="TopRole" style={{ width: columnWidth }}>
          <div
            className={classNames}
            style={{
              height: this.calculateColumnHeight(role)
            }}
          >
            &nbsp;
          </div>
          <span className="TopRole-name">{role.role}</span>
        </div>
      );
    });
  }
}
export default withTranslation()(TopRolesPanel);
