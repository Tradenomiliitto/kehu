import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

export default function WelcomePanel() {
  const [t, i18n] = useTranslation();
  return (
    <Fragment>
      <div className="row Welcome">
        <div className="col col-xs-12 col-md-4">
          <div className="Welcome-image">
            <img src="/images/kehu-thumbs-up.svg" alt="Tervetuloa" />
          </div>
        </div>
        <div className="col col-xs-12 col-md-8">
          <h2 className="Welcome-title">
            {t("home.welcome.title", "Tervetuloa Kehuun!")}
          </h2>
          <p className="Welcome-text">
            {t("home.welcome.text-1", "Mahtavaa, että löysit tiesi Kehuun!")}
          </p>
          <p className="Welcome-text">
            {t(
              "home.welcome.text-2",
              "Aloita Kehun käyttö lisäämällä uusi kehu - se voi olla jotain mitä sinulle on sanottu, kirjoitettu, annettu formaalina palautteena, tai minkä vain itse koet kehuksi."
            )}
          </p>
          <p className="Welcome-text">
            {t(
              "home.welcome.text-3",
              "Aloita tiesi oman osaamisesi tilastoguruksi heti ja tallenna ensimmäinen kehusi!"
            )}
          </p>
        </div>
      </div>
      <div className="row Welcome">
        <div className="col col-xs-12">
          <p className="Welcome-text">
            {t(
              "home.welcome.text-1",
              "Huomioithan, että voit jatkossa liittää Kehu-tiliisi myös muita käytössäsi olevia sähköpostiosoitteita. Kehujen lähettämisen yhteydessä toimitetaan vastaanottajalle aina myös sähköposti, josta löytyy ohjaus osoitteen liittämiseen omaan tiliin. Tämä tarkoittaa myös, että sinun ei tarvitse tietää, mitä sähköpostiosoitetta esimerkiksi kollegasi käyttää Kehu-tilillään, sillä kaikki vastaanotetut kehut on mahdollista liittää samalle tilille."
            )}
          </p>
        </div>
      </div>
    </Fragment>
  );
}
