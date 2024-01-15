import type { Load, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { Word } from "@/types/words";

export const useModalWordsStore = defineStore("modalWords", {
	state: () => ({
		words: [] as Array<Word>,
		count: 0,
		loadState: "initial" as Load,
	}),
	actions: {
		async fetchModalWords(params: RequestParams) {
			try {
				this.loadState = "loading";
				const { data } = await WordsApi.query(params);
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
		},
	},
});
