import type { Login, AuthToken } from "@/types/auth";
import { ApiTransport } from "../apiTransport";

export const AuthService = {
  ENDPOINT: "/api/v1/auth",

  login(data: Login) {
    return ApiTransport.post<AuthToken>(`${this.ENDPOINT}/login`, data);
  },
};
