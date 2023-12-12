import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesApi } from "@/api";
import type { Category, DraftCategory } from "@/types/categories";
import { usePageCategoriesStore } from "./pageCategories";
import { useModalCategoriesStore } from "./modalCategories";

export const useCommonCategories = defineStore("commonCategories", {

	getters: {
		getCategoryById() {
			return (id: Id) => {
				const pageStore = usePageCategoriesStore();
				const modalStore = useModalCategoriesStore();

				return pageStore.categories.find((c) => c.id === id) || 
					modalStore.categories.find((c) => c.id === id);
			};
		},
	},

	actions: {
		async createCategory(category: DraftCategory) {
			const pageStore = usePageCategoriesStore();

			try {
				const { data } = await CategoriesApi.create(category);
				pageStore.categories = [...pageStore.categories, data];
			} catch (error) {
				console.error(error);
			}
		},

		async updateCategory(id: Id, category: DraftCategory | Category) {
			const pageStore = usePageCategoriesStore();

			try {
				const { data } = await CategoriesApi.update(id, category);
				pageStore.categories = 
					pageStore.categories.map((c) => (c.id === data.id ? data : c));
			} catch (error) {
				console.error(error);
			}
		},

		async deleteCategory(id: Id) {
			const pageStore = usePageCategoriesStore();

			try {
				await CategoriesApi.delete(id);
				pageStore.categories = pageStore.categories.filter((c) => c.id !== id);
			} catch (error) {
				console.error(error);
			}
		},
	}, 

});
