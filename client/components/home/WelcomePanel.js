import React, { Fragment } from "react";

export default function WelcomePanel() {
  return (
    <Fragment>
      <div className="row Welcome">
        <div className="col col-xs-12 col-md-4">
          <div className="Welcome-image">
            <img src="/images/kehu-thumbs-up.svg" alt="Tervetuloa" />
          </div>
        </div>
        <div className="col col-xs-12 col-md-8">
          <h2 className="Welcome-title">Tervetuloa Kehuun!</h2>
          <p className="Welcome-text">Mahtavaa, että löysit tiesi Kehuun!</p>
          <p className="Welcome-text">
            Aloita Kehun käyttö lisäämällä uusi kehu - se voi olla jotain mitä
            sinulle on sanottu, kirjoitettu, annettu formaalina palautteena, tai
            minkä vain itse koet kehuksi.
          </p>
          <p className="Welcome-text">
            Aloita tiesi oman osaamisesi tilastoguruksi heti ja tallenna
            ensimmäinen kehusi!
          </p>
        </div>
      </div>
      <div className="row Welcome">
        <div className="col col-xs-12">
          <p className="Welcome-text">
            Mikäli olet rekisteröitynyt Facebookin tai Googlen kautta, käythän
            lisäämässä oman sähköpostisi omaan profiiliisi, jotta muiden
            lähettämien kehujen vastaanottaminen olisi mahdollisimman
            vaivatonta.
          </p>
          <p className="Welcome-text">
            Huomioithan, että voit jatkossa liittää Kehu-tiliisi myös muita
            käytössäsi olevia sähköpostiosoitteita. Kehujen lähettämisen
            yhteydessä toimitetaan vastaanottajalle aina myös sähköposti, josta
            löytyy ohjaus osoitteen liittämiseen omaan tiliin. Tämä tarkoittaa
            myös, että sinun ei tarvitse tietää, mitä sähköpostiosoitetta
            esimerkiksi kollegasi käyttää Kehu-tilillään, sillä kaikki
            vastaanotetut kehut on mahdollista liittää samalle tilille.
          </p>
        </div>
      </div>
    </Fragment>
  );
}
