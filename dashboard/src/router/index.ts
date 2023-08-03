import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory("/admin"),
	routes: [
		{
			path: "/",
			component: () => import("../views/Panel/index.vue"),
			children: [
				{
					path: "/words",
					name: "words",
					component: () => import("../views/Panel/WordsView.vue"),
				},
				{
					path: "/settings",
					name: "settings",
					component: () => import("../views/Panel/SettingsView.vue"),
				},

			],
		},
		{
			path: "/word",
			name: "edit-word",
			component: () => import("../views/EditWordView.vue"),
		},

	],
});

export default router;
