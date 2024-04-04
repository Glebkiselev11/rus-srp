import "./styles/main.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./i18n";
import { initApiTransport } from "@/api/apiTransport";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

initApiTransport(router);

app.mount("#app");
