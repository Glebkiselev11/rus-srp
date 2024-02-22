import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export * from "./words";
export * from "./images";
export * from "./categories";
export * from "./translations";
export * from "./auth";
