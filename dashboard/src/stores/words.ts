import type { Id, RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { DraftWord, Word } from "@/types/words";

export const useWordsStore = defineStore("words", {
	state: () => ({
		words: [] as Array<Word>,
		count: 0,
	}),
	getters: {
		getWordById(state) {
			return (id: number) => state.words.find((w) => w.id === id);
		},
	},
	actions: {
		async createWord(word: DraftWord) {
			try {
				const { data } = await WordsApi.create(word);
				this.words = [...this.words, data];	
			} catch (error) {
				console.error(error);	
			}
		},

		async fetchWords(params: RequestParams) {
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
				const { data } = await WordsApi.update(id, word);
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
