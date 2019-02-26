import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import WordCloud from "./WordCloud";
import { capitalizeText } from "../../util/TextUtil";

export default class WordCloudField extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    cloudItems: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    placeholder: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
  }

  render() {
    const { inputValue } = this.state;
    const {
      className,
      cloudItems,
      id,
      label,
      placeholder,
      values
    } = this.props;
    return (
      <div className={`Form-group ${className}Container`}>
        <label htmlFor={id} className="label-js">
          {label}
        </label>
        <WordCloud
          cloudItems={cloudItems}
          handleClick={this.handleWordCloudClick}
          values={values}
        />
        <input
          id={id}
          className={`WordCloudField ${className}Field input-js`}
          name={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={this.handleInputChange}
          onKeyPress={this.handleKeyPress}
        />
        <button
          className={`Button add-js ${id}-add-nw`}
          onClick={this.handleAddClick}
        >
          Lisää
        </button>
        {this.renderItems()}
      </div>
    );
  }

  renderItems() {
    const { id } = this.props;
    return this.props.values.map(item => {
      return (
        <div className="WordCloudValue item-js" key={item}>
          {capitalizeText(item)}
          <button
            className={`WordCloudValue-removeButton ${id}-remove-nw`}
            onClick={this.handleRemoveClick(item)}
          >
            &#10005;
          </button>
        </div>
      );
    });
  }

  handleInputChange = ({ target: { value } }) => {
    this.setState({ inputValue: value });
  };

  handleKeyPress = ev => {
    if (ev.key === "Enter") {
      this.handleAddClick(ev);
    }
  };

  handleWordCloudClick = text => {
    const { values } = this.props;
    const items = values.includes(text)
      ? values.filter(it => it !== text)
      : [...new Set([...this.props.values, text])];
    this.setState({ inputValue: "" }, () => {
      this.props.handleChange(items);
    });
  };

  handleAddClick = ev => {
    ev.preventDefault();

    if (!this.state.inputValue) {
      return;
    }

    const items = [...new Set([...this.props.values, this.state.inputValue])];
    this.setState({ inputValue: "" }, () => {
      this.props.handleChange(items);
    });
  };

  handleRemoveClick = item => {
    return ev => {
      ev.preventDefault();
      const items = this.props.values.filter(it => it !== item);
      this.props.handleChange(items);
    };
  };
}
