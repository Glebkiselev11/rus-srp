import { AuthApi } from "@/api";
import type { Login } from "@/types/auth";

export const TOKEN_KEY = "auth_token";

export async function login(data: Login) {
  try {
    const {
      data: { token },
    } = await AuthApi.login(data);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    throw e;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
