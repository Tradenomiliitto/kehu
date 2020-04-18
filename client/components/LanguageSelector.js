import React, { useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import languages from "../../languages.json";

const customStyles = {
  container: base => ({
    ...base,
    display: "inline-block",
    width: "7em",
    marginLeft: "1em",
    top: "10px"
  }),
  valueContainer: base => ({
    ...base,
    minHeight: "30px"
  }),
  control: base => ({
    ...base,
    backgroundColor: "transparent",
    border: 0,
    boxShadow: 0,
    "&:hover": {
      border: 0
    }
  })
};

const LanguageSelector = () => {
  const [t, i18n] = useTranslation();

  // Find correct language
  let language = languages.find(lang => lang.value === i18n.language);
  if (language == null) language = languages[0];

  const [selectedValue, setSelectedValue] = useState(language);

  return (
    <Select
      styles={customStyles}
      options={languages}
      components={{
        IndicatorSeparator: () => null,
        Input: () => null
      }}
      value={selectedValue}
      onChange={selectedOption => {
        setSelectedValue(selectedOption);
        i18n.changeLanguage(selectedOption.value);
      }}
    />
  );
};

export default LanguageSelector;
