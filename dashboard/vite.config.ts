import path from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
		},
	},
});
