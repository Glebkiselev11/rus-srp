/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	extends: [
		"plugin:vue/vue3-recommended",
		"plugin:vue/vue3-essential",
		"@vue/eslint-config-typescript/recommended",
	],
	rules: {
		"max-len": ["error", {
			code: 100,
		}],
		indent: ["error", "tab"],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"comma-dangle": ["error", "always-multiline"],
		"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
		"vue/no-v-html": "off",
		"vue/html-indent": ["error", "tab", {
			"attribute": 1,
			"baseIndent": 1,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": [],
		}],
		"object-curly-spacing": ["error", "always"],
		"comma-spacing": [2, { "before": false, "after": true }],
	},
};
