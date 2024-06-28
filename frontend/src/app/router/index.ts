import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory("/admin"),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Panel/PanelView.vue"),
      redirect: "/words",
      children: [
        {
          path: "/words",
          name: "words",
          component: () => import("@/views/Panel/WordsView.vue"),
        },
        {
          path: "/settings",
          name: "settings",
          component: () => import("@/views/Panel/SettingsView.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
  ],
});

export default router;
