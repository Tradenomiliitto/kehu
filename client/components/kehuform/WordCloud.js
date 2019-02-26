import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import TagCloud from "react-tag-cloud";
import { capitalizeText } from "../../util/TextUtil";

export default class WordCloud extends PureComponent {
  static propTypes = {
    cloudItems: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="WordCloudContainer">
        <div className="WordCloudWrapper">
          <TagCloud
            style={{
              fontFamily: '"Work Sans", sans-serif',
              fontWeight: 300,
              padding: 1,
              width: "100%",
              height: "100%"
            }}
            random={() => {}}
            className="WordCloud"
          >
            {this.renderCloudItems()}
          </TagCloud>
        </div>
      </div>
    );
  }

  renderCloudItems() {
    const { cloudItems, values } = this.props;
    return cloudItems.map((item, i) => {
      const classNames = cn({
        "WordCloud-item": true,
        "WordCloud-item--active": values.includes(item.text.toLowerCase()),
        "WordCloud-item--medium": i % 3 === 0 && i % 5 !== 0,
        "WordCloud-item--large": i % 3 === 0 && i % 5 === 0
      });
      return (
        <div
          key={i}
          className={classNames}
          onClick={this.handleItemClick(item.text)}
        >
          {capitalizeText(item.text)}
        </div>
      );
    });
  }

  handleItemClick = text => {
    return () => this.props.handleClick(text);
  };
}
