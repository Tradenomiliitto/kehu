import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LangLink = props => {
  const [t, i18n] = useTranslation();

  const { to, children, ...rest } = props;
  const linkTo = `/${i18n.language}${to}`;

  return <Link {...{ ...rest, to: linkTo }}>{children}</Link>;
};
