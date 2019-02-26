import React from "react";

function partnerLogo(partner) {
  return (
    <div className="col col-xs-6 col-md-3 col-lg-2">
      <img
        className="Footer-partner"
        src={`/images/logo-${partner}-square.png`}
        alt={partner}
      />
    </div>
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
              <p className="Footer-copyright">© Tradenomiliitto 2018</p>
              <div className="Footer-partners">
                <div className="row">
                  <div className="col col-lg-2" />
                  {partnerLogo("futuuri")}
                  {partnerLogo("montevista")}
                  {partnerLogo("yka")}
                  {partnerLogo("up")}
                </div>
              </div>
              <ul className="Footer-links">
                <li>
                  <a className="Footer-link" href="/blogi">
                    Blogi
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
