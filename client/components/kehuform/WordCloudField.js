import React, { Component } from "react";
import PropTypes from "prop-types";

export default class WordCloudField extends Component {
  static propTypes = {
    className: PropTypes.string,
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
    const { className, id, label, placeholder } = this.props;
    return (
      <div className={`Form-group ${className}Container`}>
        <label htmlFor={id} className="label-js">
          {label}
        </label>
        <input
          id={id}
          className={`WordCloudField ${className}Field input-js`}
          name={id}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={this.handleInputChange}
        />
        <button className="Button add-js" onClick={this.handleAddClick}>
          Lisää
        </button>
        {this.renderItems()}
      </div>
    );
  }

  renderItems() {
    return this.props.values.map(item => {
      return (
        <div className="WordCloudValue item-js" key={item}>
          {item}
          <button
            className="WordCloudValue-removeButton"
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
