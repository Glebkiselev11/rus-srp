import type { ListResponse, OptionalRequestParams } from "@/types/api";
import type { DraftWord, Word } from "@/types/words";
import axios, { type AxiosResponse } from "axios";

export const WordsApi = {
	ENDPOINT: "/api/v1/words",

	query(params: OptionalRequestParams): Promise<AxiosResponse<ListResponse<Word>>> {
		return axios.get(this.ENDPOINT, { params }); 
	},
	getById(id: string): Promise<AxiosResponse<Word>> {
		return axios.get(`${this.ENDPOINT}/${id}`);
	},
	create(data: DraftWord): Promise<AxiosResponse<Word>> {
		return axios.post(this.ENDPOINT, data);
	},
	update(id: string, data: Word): Promise<AxiosResponse<Word>> {
		return axios.put(`${this.ENDPOINT}/${id}`, data);
	},
	delete(id: number): Promise<AxiosResponse<void>> {
		return axios.delete(`${this.ENDPOINT}/${id}`);
	},
};
