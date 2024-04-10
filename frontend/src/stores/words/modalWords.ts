import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesService } from "@/api";

export const useModalWordsStore = defineStore("modalWords", {
  state: () => ({
    selectedWordIds: [] as Array<Id>,
  }),
  getters: {
    isAnyWordSelected(): boolean {
      return this.selectedWordIds.length > 0;
    },
  },
  actions: {
    updateSelectedWordIds(id: Id, select: boolean) {
      if (select) {
        this.selectedWordIds.push(id);
      } else {
        this.selectedWordIds = this.selectedWordIds.filter((i) => i !== id);
      }
    },
    async addSelectedWordsToCategory(categoryId: Id) {
      try {
        await CategoriesService.addWords(categoryId, this.selectedWordIds);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
