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
      },
    },
  ],
};
