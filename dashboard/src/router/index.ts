import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
	history: createWebHistory("/admin"),
	routes: [
		{
			path: "/",
			component: () => import("../views/HomeView.vue"),
			children: [
				{
					path: "/words",
					name: "words",
					component: () => import("../views/WordsView.vue"),
				},
				{
					path: "/settings",
					name: "settings",
					component: () => import("../views/SettingsView.vue"),
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
