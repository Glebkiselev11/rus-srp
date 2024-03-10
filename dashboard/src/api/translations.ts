import type { TranslationObject } from "@/types/translations";
import axios, { type AxiosResponse } from "axios";

export const TranslationsApi = {
	ENDPOINT: "/api/v1/private/services/translation",

	translate(params: TranslationObject): Promise<AxiosResponse<TranslationObject>> {
		return axios.post(`${this.ENDPOINT}/translate`, params);	
	},
};
