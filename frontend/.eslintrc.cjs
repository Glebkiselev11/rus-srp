/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-typescript/recommended",
    "prettier",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["warn"],
    "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 1 }],
    "eol-last": ["error", "always"],
    "vue/no-v-html": "off",
    "object-curly-spacing": ["warn", "always"],
    "comma-spacing": [2, { before: false, after: true }],
  },
};
