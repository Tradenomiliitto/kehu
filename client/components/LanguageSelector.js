import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getProfile } from "../redux/profile";
import PropTypes from "prop-types";
import languages from "../../languages.json";

const LanguageSelector = ({ device }) => {
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();

  // Find correct language
  let language = languages.find(lang => lang.value === i18n.language);
  if (language == null) language = languages[0];

  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguageSelector = () => setIsOpen(!isOpen);

  const changeLanguage = (e, newLanguage) => {
    e.preventDefault();
    setIsOpen(false);
    i18n.changeLanguage(newLanguage);
    // Profile contains localized default tags and situations so need to reload
    dispatch(getProfile(newLanguage));
  };

  if (device == null) device = "desktop";

  return (
    <>
      <li
        className={
          "Header-menuItem Header-languageSelect Header-language--" + device
        }
      >
        {languageToggleLabel(
          language,
          device,
          isOpen,
          t,
          toggleLanguageSelector
        )}
        {isOpen &&
          device === "desktop" &&
          languageList(languages, device, i18n.language, changeLanguage)}
      </li>
      {isOpen &&
        device === "mobile" &&
        languageList(languages, device, i18n.language, changeLanguage)}
    </>
  );
};

function languageToggleLabel(
  language,
  device,
  isOpen,
  t,
  toggleLanguageSelector
) {
  const html =
    device === "desktop"
      ? language.value.toUpperCase() + "&nbsp;&blacktriangledown;"
      : t("header.change-language") +
        "&nbsp;" +
        (isOpen ? "&blacktriangledown;" : "&blacktriangleright;");

  return (
    <span
      onClick={toggleLanguageSelector}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function languageList(languages, device, activeLanguage, changeLanguage) {
  if (device === "desktop") {
    // Active language not shown in desktop dropdown
    languages = languages.filter(lang => lang.value !== activeLanguage);
    return (
      <div className="Header-languageDropdown Header-language--desktop Header-menuItem">
        {languages.map(lang => (
          <LanguageLink
            lng={lang.value}
            clickHandler={changeLanguage}
            key={lang.value}
          />
        ))}
      </div>
    );
  } else {
    // Mobile
    return languages.map(lang => (
      <li
        key={"lngList" + lang.value}
        className="Header-menuItem Header-languageItem Header-language--mobile"
      >
        <LanguageLink lng={lang.value} clickHandler={changeLanguage} />
      </li>
    ));
  }
}

function LanguageLink({ lng, clickHandler }) {
  return (
    <a
      className="Header-languageItem"
      onClick={e => clickHandler(e, lng)}
      href={`/${lng}/`}
    >
      {lng.toUpperCase()}
    </a>
  );
}

LanguageSelector.propTypes = {
  device: PropTypes.oneOf(["mobile", "desktop"])
};

export default LanguageSelector;
