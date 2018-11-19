import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { addKehu } from "../../redux/kehu";
import WordCloudField from "./WordCloudField";
import GiverNameField from "./GiverNameField";
import TextField from "./TextField";
import DateGivenField from "./DateGivenField";

export class KehuForm extends Component {
  static propTypes = {
    addKehu: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      giver_id: props.profile.id,
      owner_id: props.profile.id,
      giver_name: "",
      text: "",
      date_given: moment(),
      tags: [],
      situations: []
    };
  }

  render() {
    const { giver_name, text, date_given, tags, situations } = this.state;
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
          label={
            <span>
              Kehun asiasanat
              <br />
              (taidot ja ominaisuudet)
            </span>
          }
          placeholder="Uusi asiasana"
          values={tags}
          handleChange={this.handleChangeWithValue("tags")}
        />
        <WordCloudField
          id="situations"
          className="Situation"
          label="Kehu koskee tilannetta"
          placeholder="Uusi tilanne"
          values={situations}
          handleChange={this.handleChangeWithValue("situations")}
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
  profile: state.profile.profile
});

const mapDispatchToProps = {
  addKehu
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KehuForm);
