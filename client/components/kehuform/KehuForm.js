import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { addKehu, updateKehu } from "../../redux/kehu";
import WordCloudField from "./WordCloudField";
import GiverNameField from "./GiverNameField";
import TextField from "./TextField";
import DateGivenField from "./DateGivenField";
import RoleSelectPanel from "./RoleSelectPanel";
import ErrorPanel from "../ErrorPanel";
import ImportanceSelecPanel from "./ImportanceSelectPanel";

export class KehuForm extends Component {
  static propTypes = {
    addKehu: PropTypes.func.isRequired,
    error: PropTypes.object,
    kehu: PropTypes.object,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    roles: PropTypes.array.isRequired,
    updateKehu: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const kehu = props.kehu || {};
    this.state = {
      giver_id: props.profile.id,
      owner_id: props.profile.id,
      giver_name: kehu.giver_name || "",
      role_id: kehu.role_id || null,
      text: kehu.text || "",
      date_given: kehu.date_given ? moment(kehu.date_given) : moment(),
      tags: kehu.tags ? kehu.tags.map(t => t.text) : [],
      situations: kehu.situations ? kehu.situations.map(s => s.text) : [],
      importance: kehu.importance || 0
    };
  }

  render() {
    const {
      giver_name,
      text,
      date_given,
      tags,
      situations,
      role_id,
      importance
    } = this.state;
    const { roles } = this.props;
    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        {this.renderErrors()}
        <GiverNameField
          value={giver_name}
          handleChange={this.handleChangeWithEvent("giver_name")}
        />
        <RoleSelectPanel
          selected={role_id}
          roles={roles}
          handleClick={this.handleRoleChange}
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
        <ImportanceSelecPanel
          value={importance}
          handleClick={this.handleChangeWithValue("importance")}
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

  handleRoleChange = role_id => {
    this.setState({ role_id });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    const { kehu, updateKehu, addKehu } = this.props;
    const formData = {
      ...this.state,
      date_given: moment(this.state.date_given).format()
    };
    if (kehu) {
      updateKehu(kehu.id, formData);
    } else {
      addKehu(formData);
    }
  };
}

const mapStateToProps = state => ({
  error: state.kehu.error,
  profile: state.profile.profile,
  roles: state.profile.roles
});

const mapDispatchToProps = {
  addKehu,
  updateKehu
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KehuForm);
