import type { Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesApi } from "@/api";
import type { Category, DraftCategory } from "@/types/categories";

export const useCategoriesStore = defineStore("categories", {
	state: () => ({
		categories: [] as Array<Category>,
		count: 0,
		loadState: "initial" as Load,
	}),

	getters: {
		getCategoryById(state) {
			return (id: number) => state.categories.find((c) => c.id === id);
		},
	},

	actions: {
		async fetchCategories(params: RequestParams) {
			try {
				this.loadState = "loading";
				const { data } = await CategoriesApi.query(params);
				this.categories = data.result;
				this.count = data.count;
				this.loadState = "loaded";
			} catch (error) {
				console.error(error);
				this.loadState = "error";
			} 
		},

		async updateCategory(id: number, category: DraftCategory | Category) {
			try {
				const { data } = await CategoriesApi.update(id, category);
				this.categories = this.categories.map((c) => (c.id === data.id ? data : c));
			} catch (error) {
				console.error(error);
			}
		},

		async createCategory(category: DraftCategory) {
			try {
				const { data } = await CategoriesApi.create(category);
				this.categories = [...this.categories, data];
			} catch (error) {
				console.error(error);
			}
		},

		async deleteCategory(id: number) {
			try {
				await CategoriesApi.delete(id);
				this.categories = this.categories.filter((c) => c.id !== id);
			} catch (error) {
				console.error(error);
			}
		},
	}, 

});
