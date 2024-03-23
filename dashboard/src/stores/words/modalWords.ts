import type { Id, Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesService, WordsService } from "@/api";
import type { Word } from "@/types/words";

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
      try {
        this.loadState = "loading";
        const { data } = await WordsService.query(params);
        this.words = this.words.concat(data.result);
        this.count = data.count;
        this.loadState = "loaded";
      } catch (error) {
        console.error(error);
        this.loadState = "error";
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
