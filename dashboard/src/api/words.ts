import type { ListResponse, RequestParams } from "@/types/api";
import type { DraftWord, Word } from "@/types/words";
import axios from "axios";

export const WordsApi = {
	ENDPOINT: "/api/v1/words",

	query(params: RequestParams): Promise<ListResponse<Word>> {
		return axios.get(this.ENDPOINT, { params }); 
	},
	getById(id: string): Promise<Word> {
		return axios.get(`${this.ENDPOINT}/${id}`);
	},
	create(data: DraftWord): Promise<Word> {
		return axios.post(this.ENDPOINT, data);
	},
	update(id: string, data: Word): Promise<Word> {
		return axios.put(`${this.ENDPOINT}/${id}`, data);
	},
	delete(id: string): Promise<void> {
		return axios.delete(`${this.ENDPOINT}/${id}`);
	},
};
