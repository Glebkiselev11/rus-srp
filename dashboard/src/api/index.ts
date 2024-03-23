import { TOKEN_KEY } from "@/common/auth";
import axios from "axios";
import type { Router } from "vue-router";

export * from "./words";
export * from "./images";
export * from "./categories";
export * from "./translations";
export * from "./auth";

export const initApiTransport = (router: Router) => {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        router.push({ name: "login" });
      }
      throw error;
    }
  );
};
