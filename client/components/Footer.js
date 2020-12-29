import React from "react";
import { useTranslation } from "react-i18next";

function partnerLogo(partner) {
  return (
    <img
      className="Footer-partner"
      src={`/images/logo-${partner}-square.png`}
      alt={partner}
    />
  );
}

export default function Footer() {
  const [t, i18n] = useTranslation();
  return (
    <div className="Footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <div>
              <img className="Footer-logo" src="/images/kehu-logo.png" />
              <p className="Footer-copyright">
                © {t("footer.tradenomiliitto", "Tradenomiliitto")}{" "}
                {new Date().getFullYear()}
              </p>
              <div className="Footer-partners">
                {partnerLogo("tral")}
                {partnerLogo("akava")}
                {partnerLogo("ae")}
                {partnerLogo("ekonomit")}
                {partnerLogo("futuuri")}
                {partnerLogo("insinooriliitto")}
                {partnerLogo("loimu")}
                {partnerLogo("montevista")}
                {partnerLogo("talentia")}
                {partnerLogo("up")}
                {partnerLogo("yka")}
                {partnerLogo("yty")}
              </div>
              <ul className="Footer-links">
                {i18n.language === "fi" && (
                  <li>
                    <a className="Footer-link" href={`/${i18n.language}/blogi`}>
                      {t("footer.blog", "Blogi")}
                    </a>
                  </li>
                )}
                <li>
                  <a className="Footer-link" href={`/${i18n.language}/info`}>
                    {t("footer.info", "Info")}
                  </a>
                </li>
                <li>
                  <a
                    className="Footer-link"
                    href={`/${i18n.language}/kayttoehdot`}
                  >
                    {t("footer.terms", "Käyttöehdot")}
                  </a>
                </li>
                <li>
                  <a
                    className="Footer-link"
                    href={`/${i18n.language}/rekisteriseloste`}
                  >
                    {t("footer.privacy-policy", "Rekisteriseloste")}
                  </a>
                </li>
                <li>
                  <a
                    className="Footer-link"
                    href={
                      i18n.language === "en"
                        ? "https://www.tradenomi.fi/en/contacts/"
                        : "https://www.tradenomi.fi/yhteystiedot/"
                    }
                  >
                    {t("footer.contact-details", "Yhteystiedot")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
