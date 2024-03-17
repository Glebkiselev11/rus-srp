import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { WordsApi } from "@/api";
import type { DraftWord, Word } from "@/types/words";
import { convertWordToDraftWord } from "@/common/utils";
import { usePageWordsStore } from "./pageWords";
import { useModalWordsStore } from "./modalWords";

export const useWordsActionsStore = defineStore("wordsActions", {
  getters: {
    getWordById() {
      return (id: Id) => {
        const pageState = usePageWordsStore();
        const modalState = useModalWordsStore();
        const findFn = (w: Word) => w.id === id;

        return pageState.words.find(findFn) || modalState.words.find(findFn);
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
      const modalState = useModalWordsStore();

      try {
        const { data } = await WordsApi.update(
          id,
          convertWordToDraftWord(word)
        );
        const mapFn = (w: Word) => (w.id === id ? data : w);
        pageState.words = pageState.words.map(mapFn);
        modalState.words = modalState.words.map(mapFn);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    },

    async deleteWord(id: Id) {
      const pageState = usePageWordsStore();
      const modalState = useModalWordsStore();
      try {
        await WordsApi.delete(id);
        const filterFn = (w: Word) => w.id !== id;
        pageState.words = pageState.words.filter(filterFn);
        modalState.words = modalState.words.filter(filterFn);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    },
  },
});
