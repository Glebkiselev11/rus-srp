import { defineStore } from "pinia";
import { WordsService } from "@/api";
import type { Id } from "@/types/api";

import type { DraftWord, Word } from "@/types/words";
import { convertWordToDraftWord } from "@/common/utils";
import { useModalWordsStore } from "./modalWords";

export const useWordsActionsStore = defineStore("wordsActions", {
  actions: {
    async createWord(word: DraftWord) {
      try {
        await WordsService.create(word);
      } catch (error) {
        console.error(error);
      }
    },
    async updateWord(id: Id, word: Word | DraftWord) {
      const modalState = useModalWordsStore();

      try {
        const { data } = await WordsService.update(
          id,
          convertWordToDraftWord(word)
        );
        const mapFn = (w: Word) => (w.id === id ? data : w);
        modalState.words = modalState.words.map(mapFn);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    },
  },
});
