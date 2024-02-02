import axios, { type AxiosResponse } from "axios";
import type { Login, AuthToken } from "@/types/auth";

export const AuthApi = {
	ENDPOINT: "/api/v1/auth",
	login(data: Login): Promise<AxiosResponse<AuthToken>> {
		return axios.post(`${this.ENDPOINT}/login`, data);
	},
};
