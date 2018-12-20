import { truncateText } from "./TextUtil";

describe("client:utils:TextUtil", () => {
  describe("truncateText", () => {
    it("truncates texts to given length", () => {
      const text =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniit villasukat, joista odotan tämän joulun parasta lahjaa.";
      const expectedText =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniit villasukat, joista…";
      expectText(text, 100, expectedText);
    });

    it("truncates text to shorter length", () => {
      const text =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniit villasukat, joista odotan tämän joulun parasta lahjaa.";
      const expectedText = "Martti Ahtisaari on…";
      expectText(text, 20, expectedText);
    });

    it("trims whitespace", () => {
      const text =
        "  Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla        kutoi minulle kauniit villasukat, joista odotan tämän joulun parasta lahjaa.     ";
      const expectedText =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniit villasukat, joista…";
      expectText(text, 100, expectedText);
    });

    it("does not truncate short enough text", () => {
      const text = "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon.";
      const expectedText =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon.";
      expectText(text, 100, expectedText);
    });

    it("removes html tags from text", () => {
      const text =
        '<p>Martti Ahtisaari on <span class="jooh">ansainnut </span> nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniit villasukat, joista odotan tämän joulun parasta lahjaa.</p>';
      const expectedText =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniit villasukat, joista…";
      expectText(text, 100, expectedText);
    });

    it("replaces following dot with ellipsis", () => {
      const text =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniita villasukatkin. Ja jotain kaunista";
      const expectedText =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniita villasukatkin…";
      expectText(text, 100, expectedText);
    });

    it("returns whole string when it is longer than truncated length and ends with dot", () => {
      const text =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniita villasukatkin.";
      const expectedText =
        "Martti Ahtisaari on ansainnut nobelin rauhanpalkinnon. Ja Salla kutoi minulle kauniita villasukatkin.";
      expectText(text, 100, expectedText);
    });

    it("returns empty string when text is undefined", () => {
      const text = undefined;
      const expectedText = "";
      expectText(text, 100, expectedText);
    });

    function expectText(text, length, expectedText) {
      expect(truncateText(text, length)).toEqual(expectedText);
    }
  });
});
