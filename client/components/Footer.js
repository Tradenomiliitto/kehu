import React from "react";

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
  return (
    <div className="Footer">
      <div className="container">
        <div className="row">
          <div className="col">
            <div>
              <img className="Footer-logo" src="/images/kehu-logo.png" />
              <p className="Footer-copyright">
                © Tradenomiliitto {new Date().getFullYear()}
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
                <li>
                  <a className="Footer-link" href="/blogi">
                    Blogi
                  </a>
                </li>
                <li>
                  <a className="Footer-link" href="/info">
                    Info
                  </a>
                </li>
                <li>
                  <a className="Footer-link" href="/kayttoehdot">
                    Käyttöehdot
                  </a>
                </li>
                <li>
                  <a className="Footer-link" href="/rekisteriseloste">
                    Rekisteriseloste
                  </a>
                </li>
                <li>
                  <a
                    className="Footer-link"
                    href="https://www.tral.fi/yhteystiedot/"
                  >
                    Yhteystiedot
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
