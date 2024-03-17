import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesApi } from "@/api";
import type { Category, DraftCategory } from "@/types/categories";
import { usePageCategoriesStore } from "./pageCategories";
import { useModalCategoriesStore } from "./modalCategories";

export const useCategoriesActions = defineStore("categoriesActions", {
  getters: {
    getCategoryById() {
      return (id: Id) => {
        const pageStore = usePageCategoriesStore();
        const modalStore = useModalCategoriesStore();

        return (
          pageStore.categories.find((c) => c.id === id) ||
          modalStore.categories.find((c) => c.id === id)
        );
      };
    },
  },

  actions: {
    async createCategory(category: DraftCategory) {
      const pageStore = usePageCategoriesStore();
      const modalStore = useModalCategoriesStore();

      try {
        const { data } = await CategoriesApi.create(category);
        pageStore.categories = [...pageStore.categories, data];
        modalStore.categories = [...modalStore.categories, data];
      } catch (error) {
        console.error(error);
      }
    },

    async updateCategory(id: Id, category: DraftCategory | Category) {
      const pageStore = usePageCategoriesStore();
      const modalStore = useModalCategoriesStore();

      try {
        const { data } = await CategoriesApi.update(id, category);
        const fn = (c: Category) => (c.id === data.id ? data : c);

        pageStore.categories = pageStore.categories.map(fn);
        modalStore.categories = modalStore.categories.map(fn);
      } catch (error) {
        console.error(error);
      }
    },

    async deleteCategory(id: Id) {
      const pageStore = usePageCategoriesStore();
      const modalStore = useModalCategoriesStore();

      try {
        await CategoriesApi.delete(id);
        const fn = (c: Category) => c.id !== id;

        pageStore.categories = pageStore.categories.filter(fn);
        modalStore.categories = modalStore.categories.filter(fn);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
