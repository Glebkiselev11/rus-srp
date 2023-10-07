import type { RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesApi } from "@/api";
import type { Category } from "@/types/categories";

export const useCategoriesStore = defineStore("categories", {
	state: () => ({
		categories: [] as Array<Category>,
		count: 0,
	}),
	actions: {
		async fetchCategories(params: RequestParams) {
			try {
				const { data } = await CategoriesApi.query(params);
				this.categories = data.result;
				this.count = data.count;
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},
	}, 
});
