import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";

export class SendKehuSuccessPanel extends Component {
  static propTypes = {
    // i18n prop coming from withTranslation()
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t } = this.props;
    return (
      <div className="SendKehuSuccess">
        <img
          src="/images/kehu-sent-thumb.png"
          className="SendKehuSuccess-image"
        />
        <h3 className="SendKehuSuccess-title success-title-nw">
          {t("modals.send-kehu.success-title", "Kehu lähetetty!")}
        </h3>
        <p className="SendKehuSuccess-text">
          {t("modals.send-kehu.success-text", "Hienoa, jatka samaan malliin.")}
        </p>
      </div>
    );
  }
}

export default withTranslation()(SendKehuSuccessPanel);
