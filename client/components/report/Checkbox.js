import React from "react";
import PropTypes from "prop-types";

const Checkbox = ({ type = "checkbox", name, checked = false, onChange }) => (
  <div className="checkbox">
    <input
      type={type}
      name={name}
      checked={checked}
      onChange={onChange}
      id={`checkbox-${name}`}
    />
    <label htmlFor={`checkbox-${name}`}>&nbsp;</label>
  </div>
);

Checkbox.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default Checkbox;
