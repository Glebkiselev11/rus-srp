import type { RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { Word } from "@/types/words";

export const usePageWordsStore = defineStore("pageWords", {
	state: () => ({
		words: [] as Array<Word>,
		count: 0,
		lastFilters: {} as RequestParams,
	}),
	actions: {
		async fetchPageWords(params: RequestParams) {
			this.lastFilters = params;

			try {
				const { data } = await WordsApi.query(params);
				this.words = data.result;
				this.count = data.count;
			} catch (error) {
				console.error(error);
			}
		},
		async refetchPageWords() {
			await this.fetchPageWords(this.lastFilters);
		},
	},
});
