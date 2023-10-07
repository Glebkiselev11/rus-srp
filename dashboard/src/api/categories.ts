import type { ListResponse, OptionalRequestParams } from "@/types/api";
import type { Category } from "@/types/categories";
import axios, { type AxiosResponse } from "axios";

export const CategoriesApi = {
	ENDPOINT: "/api/v1/categories",

	query(params: OptionalRequestParams): Promise<AxiosResponse<ListResponse<Category>>> {
		return axios.get(this.ENDPOINT, { params }); 
	},

};
