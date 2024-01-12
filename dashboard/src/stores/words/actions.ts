import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { DraftWord, Word } from "@/types/words";
import { convertWordToDraftWord } from "@/common/utils";
import { usePageWordsStore } from "./pageWords";

export const useWordsActionsStore = defineStore("wordsActions", {
	getters: {
		getWordById() {
			return (id: Id) => {
				const pageState = usePageWordsStore();
				return pageState.words.find((w) => w.id === id);
			};
		},
	},
	actions: {
		async createWord(word: DraftWord) {
			try {
				await WordsApi.create(word);
			} catch (error) {
				console.error(error);	
			}
		},

		async updateWord(id: Id, word: Word | DraftWord) {
			const pageState = usePageWordsStore();
			try {
				const { data } = await WordsApi.update(id, convertWordToDraftWord(word));
				pageState.words = pageState.words.map((w) => (w.id === id ? data : w));
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},

		async deleteWord(id: Id) {
			const pageState = usePageWordsStore();
			try {
				await WordsApi.delete(id);
				pageState.words = pageState.words.filter((word) => word.id !== id);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		},

	},
});
