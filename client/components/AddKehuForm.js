import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import PropTypes from "prop-types";
import { addKehu } from "../redux/kehu";

function GiverNameField({ value, handleChange }) {
  return (
    <div className="Form-group">
      <label htmlFor="giver_name">Minua kehui:</label>
      <input
        id="giver_name"
        name="giver_name"
        type="text"
        placeholder="Nimi"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

function TextField({ value, handleChange }) {
  return (
    <div className="Form-group">
      <textarea
        id="text"
        className="KehuTextField"
        name="text"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

function DateGivenField({ value, handleChange }) {
  return (
    <div className="Form-group">
      <label htmlFor="giver_name">Päivämäärä:</label>
      <DatePicker
        dropdownMode="scroll"
        locale="fi-FI"
        selected={value}
        onChange={handleChange}
      />
    </div>
  );
}

function SituationField({ value, handleChange }) {
  return (
    <div className="Form-group">
      <label htmlFor="situation">Kehu koskee tilannetta</label>
      <input
        id="situation"
        name="situation"
        type="text"
        placeholder="Uusi tilanne"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

function TagsField({ value, handleChange }) {
  return (
    <div className="Form-group">
      <label htmlFor="giver_name">
        Kehun asiasanat
        <br />
        (taidot ja ominaisuudet)
      </label>
      <input
        id="tags"
        name="tags"
        type="text"
        placeholder="Uusi asiasana"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export class AddKehuForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      giver_id: props.user.id,
      owner_id: props.user.id,
      giver_name: null,
      text: null,
      date_given: moment(),
      tags: null,
      situation: null
    };
  }

  render() {
    const { giver_name, text, date_given, tags, situation } = this.state;
    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        <GiverNameField
          value={giver_name}
          handleChange={this.handleChange("giver_name")}
        />
        <TextField value={text} handleChange={this.handleChange("text")} />
        <DateGivenField
          value={date_given}
          handleChange={this.handleDateGivenChange}
        />
        <TagsField value={tags} handleChange={this.handleChange("tags")} />
        <SituationField
          value={situation}
          handleChange={this.handleChange("situation")}
        />
        <input
          type="submit"
          className="Button Button--wide"
          value="Tallenna Kehu"
        />
      </form>
    );
  }

  handleChange = field => {
    return ({ target: { value } }) => {
      this.setState({ [field]: value });
    };
  };

  handleDateGivenChange = date => {
    this.setState({ date_given: date });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const formData = {
      ...this.state,
      date_given: moment(this.state.date_given).format("D.M.YYYY")
    };
    this.props.addKehu(formData);
  };
}

const mapStateToProps = state => ({
  user: state.user.user
});

const mapDispatchToProps = {
  addKehu
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddKehuForm);
