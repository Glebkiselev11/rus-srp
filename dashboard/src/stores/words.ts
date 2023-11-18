import type { RequestParams } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { Word } from "@/types/words";

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
		async deleteWord(id: number) {
			try {
				await WordsApi.delete(id);
				this.words = this.words.filter((word) => word.id !== id);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},
		async updateWord(word: Word) {
			try {
				await WordsApi.update(word);
				this.words = this.words.map((w) => (w.id === word.id ? word : w));
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},
	},
});
