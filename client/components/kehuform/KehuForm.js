import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { addKehu, updateKehu } from "../../redux/kehu";
import WordCloudField from "./WordCloudField";
import GiverNameField from "./GiverNameField";
import TextField from "./TextField";
import DateGivenField from "./DateGivenField";
import ErrorPanel from "../ErrorPanel";

export class KehuForm extends Component {
  static propTypes = {
    addKehu: PropTypes.func.isRequired,
    updateKehu: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    kehu: PropTypes.object,
    error: PropTypes.object
  };

  constructor(props) {
    super(props);
    const kehu = props.kehu || {};
    this.state = {
      giver_id: props.profile.id,
      owner_id: props.profile.id,
      giver_name: kehu.giver_name || "",
      text: kehu.text || "",
      date_given: kehu.date_given ? moment(kehu.date_given) : moment(),
      tags: kehu.tags ? kehu.tags.map(t => t.text) : [],
      situations: kehu.situations ? kehu.situations.map(s => s.text) : []
    };
  }

  render() {
    const { giver_name, text, date_given, tags, situations } = this.state;
    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        {this.renderErrors()}
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
          className="Button Button--fullWidth submit-kehu-nw"
          value="Tallenna Kehu"
        />
      </form>
    );
  }

  renderErrors() {
    const { error } = this.props;
    if (error && error.responseJson && error.responseJson.errors) {
      return error.responseJson.errors.map((e, i) => (
        <ErrorPanel key={i} message={e.msg} />
      ));
    }
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
    const { kehu, updateKehu, addKehu } = this.props;
    const formData = {
      ...this.state,
      date_given: moment(this.state.date_given).format("D.M.YYYY")
    };
    if (kehu) {
      updateKehu(kehu.id, formData);
    } else {
      addKehu(formData);
    }
  };
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
  error: state.kehu.error
});

const mapDispatchToProps = {
  addKehu,
  updateKehu
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KehuForm);
