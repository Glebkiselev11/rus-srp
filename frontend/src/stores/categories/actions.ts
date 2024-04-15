import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesService } from "@/api";
import type { Category, DraftCategory } from "@/types/categories";
import { useModalCategoriesStore } from "./modalCategories";

export const useCategoriesActions = defineStore("categoriesActions", {
  getters: {
    getCategoryById() {
      return (id: Id) => {
        const modalStore = useModalCategoriesStore();

        return modalStore.categories.find((c) => c.id === id);
      };
    },
  },

  actions: {
    async createCategory(category: DraftCategory) {
      const modalStore = useModalCategoriesStore();

      const { data } = await CategoriesService.create(category);
      modalStore.categories = [data, ...modalStore.categories];
      return data;
    },

    async updateCategory(id: Id, category: DraftCategory | Category) {
      const modalStore = useModalCategoriesStore();

      try {
        const { data } = await CategoriesService.update(id, category);
        const fn = (c: Category) => (c.id === data.id ? data : c);

        modalStore.categories = modalStore.categories.map(fn);
      } catch (error) {
        console.error(error);
      }
    },

    async deleteCategory(id: Id) {
      const modalStore = useModalCategoriesStore();

      try {
        await CategoriesService.delete(id);
        const fn = (c: Category) => c.id !== id;

        modalStore.categories = modalStore.categories.filter(fn);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
