module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-sass-guidelines",
    "stylelint-prettier/recommended",
  ],
  rules: {
    "selector-class-pattern": null,
    "scss/at-extend-no-missing-placeholder": null,
    "color-named": null,
    "color-function-notation": "legacy", // Scss not supporting the modern notation
    "alpha-value-notation": "number", // Already used in css files
    "max-nesting-depth": 2,
  },
};
