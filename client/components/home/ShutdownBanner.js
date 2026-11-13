import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { LangLink as Link } from "../../util/LangLink";
import { SHUTDOWN_BLOG_SLUG } from "../../../utils/Shutdown";

export function ShutdownBanner({ t, i18n }) {
  return (
    <div className="ShutdownBanner shutdown-banner-nw">
      <div className="container">
        <h2 className="ShutdownBanner-title">
          {t(
            "home.shutdown-banner.title",
            "Kehu-palvelu lopetetaan 31.12.2026",
          )}
        </h2>
        <p className="ShutdownBanner-text">
          {t(
            "home.shutdown-banner.text",
            "Lataa kehusi talteen ennen palvelun lopettamista.",
          )}
        </p>
        <div className="ShutdownBanner-links">
          <a
            className="ShutdownBanner-link"
            href={`/${i18n.language}/blogi/${SHUTDOWN_BLOG_SLUG}`}
          >
            {t("home.shutdown-banner.blog-link", "Lue lisää blogista")}
          </a>
          <a
            className="ShutdownBanner-link"
            href={`/api/v1/kehut/report?lng=${i18n.language}`}
          >
            {t(
              "home.shutdown-banner.excel-link",
              "Lataa kehut Excel-tiedostona",
            )}
          </a>
          <Link className="ShutdownBanner-link" to="/raportit?pdf">
            {t(
              "home.shutdown-banner.pdf-link",
              "Lataa raportti PDF-tiedostona",
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

ShutdownBanner.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    language: PropTypes.string.isRequired,
  }).isRequired,
};

export default withTranslation()(ShutdownBanner);
