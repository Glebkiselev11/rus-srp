import type { Id, ListResponse, OptionalRequestParams } from "@/types/api";
import type { Category, DraftCategory } from "@/types/categories";
import axios, { type AxiosResponse } from "axios";

export const CategoriesApi = {
	ENDPOINT: "/api/v1/private/categories",
	create(data: DraftCategory): Promise<AxiosResponse<Category>> {
		return axios.post(`${this.ENDPOINT}/create`, data);
	},
	query(params: OptionalRequestParams): Promise<AxiosResponse<ListResponse<Category>>> {
		return axios.get(this.ENDPOINT, { params }); 
	},
	update(id: Id, data: Category | DraftCategory): Promise<AxiosResponse<Category>> {
		return axios.put(`${this.ENDPOINT}/${id}`, data);
	},
	delete(id: Id): Promise<AxiosResponse<void>> {
		return axios.delete(`${this.ENDPOINT}/${id}`);
	},
	addWords(id: Id, word_ids: Id[]): Promise<AxiosResponse<void>> {
		return axios.put(`${this.ENDPOINT}/${id}/add-words`, { word_ids });
	},
};
