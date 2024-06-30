import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/admin"),
  routes: [
    {
      path: "/",
      redirect: "/words",
    },
    {
      path: "/words",
      name: "words",
      component: () =>
        import("@/pages/Words").then((module) => module.WordsPage),
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import("@/pages/Settings").then((module) => module.SettingsPage),
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import("@/pages/Login").then((module) => module.LoginPage),
    },
  ],
});

export default router;
