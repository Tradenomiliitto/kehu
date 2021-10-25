module.exports = {
  root: true,
  env: {
    es2020: true, // Node.JS v14 supports es2020, v15 required for es2021
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended", // This must be last plugin
  ],
  rules: {
    // In Express, an error middleware is differentiated from a normal
    // middleware by the function taking 4 arguments rather than 3 arguments
    // --> last next argument is unused
    "no-unused-vars": ["warn", { argsIgnorePattern: "next" }],
    // Use warn instead of error for prettier issues
    "prettier/prettier": "warn",
    "no-console": "warn",
  },
  overrides: [
    {
      files: ["jest.setup.js"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: "client/**/*.test.js",
      globals: {
        React: true,
        shallow: true,
        fetch: true,
      },
    },
    {
      files: "client/**/*.js",
      parser: "@babel/eslint-parser",
      parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      env: {
        browser: true,
        jest: true,
      },
      extends: [
        "plugin:import/recommended",
        "plugin:react/recommended", // General React linting
        "plugin:react-hooks/recommended", // React hooks linting
        "plugin:jsx-a11y/recommended", // Accessibility linting
      ],
      rules: {
        "react/jsx-uses-vars": "warn",
        "react/jsx-uses-react": "warn",
        // Disable rule because named export is commonly used as default export.
        // This is because e.g. `export default withTranslation()(FeedPanel);`
        // is imported as FeedPanel.
        "import/no-named-as-default": "off",
        // Need to create alt texts and translations before this can be enabled
        "jsx-a11y/alt-text": "off",
        // Link tags are styled as button, needs refractoring
        "jsx-a11y/anchor-is-valid": "off",
      },
    },
  ],
};
