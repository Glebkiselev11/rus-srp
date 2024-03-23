import type { Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesService } from "@/api";
import type { Category } from "@/types/categories";

// This one is used to store categores for modal view (it is different from side page view)
export const useModalCategoriesStore = defineStore("modalCategories", {
  state: () => ({
    categories: [] as Array<Category>,
    count: 0,
    loadState: "initial" as Load,
  }),

  actions: {
    async fetchModalCategories(params: RequestParams) {
      try {
        this.loadState = "loading";
        const { data } = await CategoriesService.query(params);
        this.categories = data.result;
        this.count = data.count;
        this.loadState = "loaded";
      } catch (error) {
        console.error(error);
        this.loadState = "error";
      }
    },
  },
});
