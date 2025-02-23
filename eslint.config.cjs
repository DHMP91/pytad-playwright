const playwright = require("eslint-plugin-playwright");
const jsdoc = require("eslint-plugin-jsdoc");

module.exports = [
  {
    plugins: { playwright },
    ...playwright.configs["flat/recommended"],
    files: ["tests/**", "page-objects/**"],
    rules: { ...playwright.configs["flat/recommended"].rules },
  },
  {
    plugins: { jsdoc },
    ...jsdoc.configs["flat/recommended"],
    files: ["page-objects/**"],
    rules: { ...jsdoc.configs["flat/recommended"].rules },
  },
];