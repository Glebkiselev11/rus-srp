import type { Id, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { DraftWord, Word } from "@/types/words";
import { convertWordToDraftWord } from "@/common/utils";

export const useWordsStore = defineStore("words", {
	state: () => ({
		words: [] as Array<Word>,
		lastFetchParams: null as RequestParams | null,
		count: 0,
	}),
	getters: {
		getWordById(state) {
			return (id: Id) => state.words.find((w) => w.id === id);
		},
	},
	actions: {
		async createWord(word: DraftWord) {
			try {
				await WordsApi.create(word);
				if (this.lastFetchParams) {
					this.fetchWords(this.lastFetchParams);
				}
			} catch (error) {
				console.error(error);	
			}
		},

		async fetchWords(params: RequestParams) {
			this.lastFetchParams = params;
			try {
				const { data } = await WordsApi.query(params);
				this.words = data.result;
				this.count = data.count;
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},

		async updateWord(id: Id, word: Word | DraftWord) {
			try {
				const { data } = await WordsApi.update(id, convertWordToDraftWord(word));
				this.words = this.words.map((w) => (w.id === id ? data : w));
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},

		async deleteWord(id: Id) {
			try {
				await WordsApi.delete(id);
				this.words = this.words.filter((word) => word.id !== id);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},

	},
});
