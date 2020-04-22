import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation, Trans } from "react-i18next";
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
import CommentField from "./CommentField";

export class AddKehuForm extends Component {
  static propTypes = {
    addKehu: PropTypes.func.isRequired,
    error: PropTypes.object,
    kehu: PropTypes.object,
    profile: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired,
    roles: PropTypes.array.isRequired,
    situations: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    updateKehu: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    const kehu = props.kehu || {};
    this.state = {
      giver_id: kehu.giver_id || props.profile.id,
      owner_id: kehu.owner_id || props.profile.id,
      giver_name: kehu.giver_name || "",
      role_id: kehu.role_id || null,
      text: kehu.text || "",
      date_given: kehu.date_given ? moment(kehu.date_given) : moment(),
      tags: kehu.tags ? kehu.tags.map(t => t.text) : [],
      situations: kehu.situations ? kehu.situations.map(s => s.text) : [],
      importance: kehu.importance || 0,
      comment: kehu.comment || ""
    };
  }

  isReceivedKehu() {
    return !!(
      this.props.kehu && this.props.kehu.giver_id !== this.props.kehu.owner_id
    );
  }

  render() {
    const { t } = this.props;
    const {
      giver_name,
      text,
      date_given,
      tags,
      situations,
      role_id,
      importance,
      comment
    } = this.state;
    const { roles } = this.props;
    return (
      <form className="Form" onSubmit={this.handleSubmit}>
        {this.renderReceivedKehuNotice()}
        {this.renderErrors()}
        <GiverNameField
          disabled={this.isReceivedKehu()}
          value={giver_name}
          handleChange={this.handleChangeWithEvent("giver_name")}
        />
        <RoleSelectPanel
          disabled={this.isReceivedKehu()}
          selected={role_id}
          roles={roles}
          handleClick={this.handleRoleChange}
        />
        <TextField
          disabled={this.isReceivedKehu()}
          value={text}
          handleChange={this.handleChangeWithEvent("text")}
        />
        <DateGivenField
          disabled={this.isReceivedKehu()}
          value={date_given}
          handleChange={this.handleChangeWithValue("date_given")}
        />
        <WordCloudField
          id="tags"
          className="Tags"
          cloudItems={this.props.tags}
          label={
            <span>
              <Trans i18nKey="modals.wordcloud.label-tags">
                Kehun asiasanat
                <br />
                (taidot ja ominaisuudet)
              </Trans>
            </span>
          }
          placeholder={t("modals.wordcloud.placeholder-tags", "Uusi asiasana")}
          values={tags}
          handleChange={this.handleChangeWithValue("tags")}
        />
        <WordCloudField
          id="situations"
          className="Situation"
          cloudItems={this.props.situations}
          label={t(
            "modals.wordcloud.label-situations",
            "Kehu koskee tilannetta"
          )}
          placeholder={t(
            "modals.wordcloud.placeholder-situations",
            "Uusi tilanne"
          )}
          values={situations}
          handleChange={this.handleChangeWithValue("situations")}
        />
        <ImportanceSelecPanel
          value={importance}
          handleClick={this.handleChangeWithValue("importance")}
        />
        <CommentField
          value={comment}
          handleChange={this.handleChangeWithEvent("comment")}
        />
        <input
          type="submit"
          className="Button Button--fullWidth submit-kehu-nw"
          value={t("modals.add-kehu.save-kehu-btn", "Tallenna Kehu")}
        />
      </form>
    );
  }

  renderReceivedKehuNotice() {
    const { t } = this.props;
    if (this.isReceivedKehu()) {
      return (
        <p className="ReceivedKehuNotice">
          {t(
            "modals.claim-kehu.received-kehu-notice",
            "Saatu Kehu on muokattavissa vain asiasanojen, tilanteen, tärkeyden ja kommentin osalta. Nämä tiedot eivät näy Kehun antajalle."
          )}
        </p>
      );
    }
  }

  renderErrors() {
    const { t } = this.props;
    const { error } = this.props;
    if (error && error.responseJson && error.responseJson.errors) {
      return error.responseJson.errors.map((e, i) => (
        <ErrorPanel key={i} message={e.msg} />
      ));
    }
    if (error && error.message) {
      const action = this.props.kehu ? "päivittäminen" : "lisääminen";
      const message = t("modals.add-kehu.error", {
        action,
        error: error.message,
        defaultValue: `Valitettavasti Kehun {{action}} epäonnistui. Seuraava virhe tapahtui: {{error}}.`
      });
      return <ErrorPanel message={message} />;
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
  roles: state.profile.roles,
  situations: state.profile.situations,
  tags: state.profile.tags
});

const mapDispatchToProps = {
  addKehu,
  updateKehu
};

export default compose(
  withTranslation(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AddKehuForm);
