import type { RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { Word } from "@/types/words";

export const usePageWordsStore = defineStore("pageWords", {
	state: () => ({
		words: [] as Array<Word>,
		count: 0,
	}),
	actions: {
		async fetchPageWords(params: RequestParams) {
			try {
				const { data } = await WordsApi.query(params);
				this.words = data.result;
				this.count = data.count;
			} catch (error) {
				console.error(error);
			}
		},
	},
});
