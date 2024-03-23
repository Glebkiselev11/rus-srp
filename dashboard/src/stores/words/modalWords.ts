import type { Id, Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesService, WordsService } from "@/api";
import type { Word } from "@/types/words";
import { fetchOptions } from "@/api/utils";

export const useModalWordsStore = defineStore("modalWords", {
  state: () => ({
    words: [] as Array<Word>,
    count: 0,
    loadState: "initial" as Load,
    selectedWordIds: [] as Array<Id>,
  }),
  getters: {
    isAnyWordSelected(): boolean {
      return this.selectedWordIds.length > 0;
    },
  },
  actions: {
    async fetchModalWords(params: RequestParams) {
      const setState = (state: Load) => (this.loadState = state);

      try {
        const result = await fetchOptions(WordsService, params, setState);
        if (result) {
          this.words = result.data.result;
          this.count = result.data.count;
        }
      } catch (error) {
        console.error("Failed to fetch words for modal: ", error);
      }
    },
    clearModalWords() {
      this.words = [];
      this.count = 0;
      this.selectedWordIds = [];
    },
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
