import type { TranslateRequest, TranslateResponse } from "@/types/translations";
import axios, { type AxiosResponse } from "axios";

export const TranslationsApi = {
	ENDPOINT: "api/v1/private/services/translation",

	translate(params: TranslateRequest): Promise<AxiosResponse<TranslateResponse>> {
		return axios.post(`${this.ENDPOINT}/translate`, params);
	},
};
