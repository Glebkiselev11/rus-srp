/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	extends: [
		"plugin:vue/vue3-recommended",
		"plugin:vue/vue3-essential",
		"@vue/eslint-config-typescript/recommended",
	],
	rules: {
		"max-len": ["warn", {
			code: 150,
		}],
		indent: ["warn", "tab"],
		"quotes": ["warn", "double"],
		"semi": ["warn", "always"],
		"comma-dangle": ["warn", "always-multiline"],
		"no-multiple-empty-lines": ["warn", { "max": 1, "maxEOF": 1 }],
		"eol-last": ["error", "always"],
		"vue/no-v-html": "off",
		"vue/html-indent": ["warn", "tab", {
			"attribute": 1,
			"baseIndent": 1,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": [],
		}],
		"object-curly-spacing": ["warn", "always"],
		"comma-spacing": [2, { "before": false, "after": true }],
	},
};
