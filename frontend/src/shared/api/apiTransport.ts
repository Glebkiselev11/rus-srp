import { TOKEN_KEY } from "@/shared/auth";
import axios, { type AxiosResponse, type CancelTokenSource } from "axios";
import type { Router } from "vue-router";

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

const pendingRequests: Map<string, CancelTokenSource> = new Map();

export const ApiTransport = {
  query<T>(
    url: string,
    params: Record<string, unknown>
  ): Promise<AxiosResponse<T>> {
    if (pendingRequests.has(url)) {
      pendingRequests.get(url)?.cancel();
      pendingRequests.delete(url);
    }

    const source = axios.CancelToken.source();
    pendingRequests.set(url, source);

    return axios.get(url, {
      cancelToken: source.token,
      ...params,
    });
  },
  get<T>(url: string): Promise<AxiosResponse<T>> {
    return axios.get(url);
  },
  post<T>(
    url: string,
    data: Record<string, unknown>
  ): Promise<AxiosResponse<T>> {
    return axios.post(url, data);
  },
  put<T>(
    url: string,
    data: Record<string, unknown>
  ): Promise<AxiosResponse<T>> {
    return axios.put(url, data);
  },
  remove<T>(
    url: string,
    data?: Record<string, unknown>
  ): Promise<AxiosResponse<T>> {
    return axios.delete(url, { data });
  },
};
