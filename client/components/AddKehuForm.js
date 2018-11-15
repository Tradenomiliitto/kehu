import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import PropTypes from "prop-types";
import { addKehu } from "../redux/kehu";
import WordCloudField from "./kehuform/WordCloudField";

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
    <div className="Form-group KehuTextFieldContainer">
      <textarea
        id="text"
        className="KehuTextField"
        name="text"
        rows={7}
        placeholder="Hyvää työtä! Olet..."
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

function DateGivenField({ value, handleChange }) {
  return (
    <div className="Form-group DateGivenFieldContainer">
      <label htmlFor="date_given">Päivämäärä:</label>
      <DatePicker
        id="date_given"
        className="DateGivenField"
        dateFormat="D. MMMM YYYY"
        dropdownMode="scroll"
        locale="fi-FI"
        selected={value}
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
      tags: [],
      situation: []
    };
  }

  render() {
    const { giver_name, text, date_given, tags, situation } = this.state;
    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        <GiverNameField
          value={giver_name}
          handleChange={this.handleChangeWithEvent("giver_name")}
        />
        <TextField
          value={text}
          handleChange={this.handleChangeWithEvent("text")}
        />
        <DateGivenField
          value={date_given}
          handleChange={this.handleChangeWithValue("date_given")}
        />
        <WordCloudField
          id="tags"
          className="Tags"
          label={["Kehun asiasanat", [<br />], "(taidot ja ominaisuudet"]}
          placeholder="Uusi asiasana"
          values={tags}
          handleChange={this.handleChangeWithValue("tags")}
        />
        <WordCloudField
          id="situation"
          className="Situation"
          label="Kehu koskee tilannetta"
          placeholder="Uusi tilanne"
          values={situation}
          handleChange={this.handleChangeWithValue("situation")}
        />
        <input
          type="submit"
          className="Button Button--fullWidth"
          value="Tallenna Kehu"
        />
      </form>
    );
  }

  handleChangeWithEvent = field => {
    return ({ target: { value } }) => {
      this.setState({ [field]: value });
    };
  };

  handleChangeWithValue = field => {
    return value => {
      this.setState({ [field]: value });
    };
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
