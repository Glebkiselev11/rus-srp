import { AuthService } from "../api";
import type { Login } from "./types";
import { TOKEN_KEY } from "../config";

export async function login(data: Login) {
  try {
    const {
      data: { token },
    } = await AuthService.login(data);
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
