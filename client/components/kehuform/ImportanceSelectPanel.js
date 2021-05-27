import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import cn from "classnames";

export class ImportanceSelectPanel extends Component {
  static propTypes = {
    handleClick: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.state = {
      active: null,
    };
  }

  render() {
    const { t } = this.props;
    return (
      <div className="Form-group ImportanceSelectorContainer">
        <label htmlFor="giver_name">
          {t("modals.add-kehu.importance", "Kehun tärkeys")}
        </label>
        <div className="ImportanceSelector">{this.renderStars()}</div>
      </div>
    );
  }

  renderStars() {
    let stars = [];

    for (let i = 1; i <= 5; i++) {
      const starClass = cn({
        "ImportanceSelector-star": true,
        "ImportanceSelector-star--active": this.isActiveStar(i),
        "importance-selector-nw": true,
      });
      stars.push(
        <span
          key={i}
          className={starClass}
          onMouseOver={this.handleMouseOver(i)}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleClick(i)}
        />
      );
    }

    return stars;
  }

  isActiveStar = (number) => {
    if (this.state.active) {
      return number <= this.state.active;
    } else {
      return number <= this.props.value;
    }
  };

  handleMouseOver(number) {
    return () => this.setState({ active: number });
  }

  handleMouseOut = () => {
    this.setState({ active: null });
  };

  handleClick = (number) => {
    return () => this.props.handleClick(number);
  };
}

export default withTranslation()(ImportanceSelectPanel);
