import type { Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsService } from "@/api";
import type { Word } from "@/types/words";
import { fetchOptions } from "@/api/utils";

export const usePageWordsStore = defineStore("pageWords", {
  state: () => ({
    words: [] as Array<Word>,
    count: 0,
    lastFilters: {} as RequestParams,
    loadState: "initial" as Load,
  }),
  actions: {
    async fetchPageWords(params: RequestParams) {
      this.lastFilters = params;
      const setState = (state: Load) => (this.loadState = state);

      try {
        const result = await fetchOptions(WordsService, params, setState);
        if (result) {
          this.words = result.data.result;
          this.count = result.data.count;
        }
      } catch (error) {
        console.error("Failed to fetch words for page: ", error);
      }
    },
    async refetchPageWords() {
      await this.fetchPageWords(this.lastFilters);
    },
  },
});
