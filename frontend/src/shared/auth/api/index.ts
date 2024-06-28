import type { Login, AuthToken } from "../types";
import { ApiTransport } from "@/shared/api";

export const AuthService = {
  ENDPOINT: "/api/v1/auth",

  login(data: Login) {
    return ApiTransport.post<AuthToken>(`${this.ENDPOINT}/login`, data);
  },
};
