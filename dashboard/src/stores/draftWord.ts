import type { DraftWord, Word } from "@/types/words";
import { defineStore } from "pinia";
import { convertWordToDraftWord, isAnyFieldHasChanged } from "@/common/utils";
import { getLanguageCodesOrder, translate } from "@/common/translations";

function _initDraftWord(): DraftWord {
  return {
    rus: "",
    eng: "",
    srp_latin: "",
    srp_cyrillic: "",
    image: null,
    category_ids: [],
    translation_approved: false,
  };
}

export const useDraftWordStore = defineStore("draftWord", {
  state: () => ({
    draftWord: _initDraftWord(),
    // if we are in editing mode, we need to store the initial word
    initialWord: null as DraftWord | null,
  }),

  getters: {
    translations(state): string[] {
      return [
        state.draftWord.rus,
        state.draftWord.eng,
        state.draftWord.srp_latin,
        state.draftWord.srp_cyrillic,
      ];
    },
    anyTranslationFilled(): boolean {
      return this.translations.some((x) => Boolean(x));
    },
    allTranslationsFilled(): boolean {
      return this.translations.every((x) => Boolean(x));
    },
    semifilledTranslations(): boolean {
      return this.anyTranslationFilled && !this.allTranslationsFilled;
    },
    isEditMode(state): boolean {
      return Boolean(state.initialWord);
    },
    isChanged(state): boolean {
      if (state.initialWord) {
        return isAnyFieldHasChanged(state.initialWord, state.draftWord);
      } else {
        return isAnyFieldHasChanged(_initDraftWord(), state.draftWord);
      }
    },
    isTranslationChanged(state): boolean {
      const initialWord = state.initialWord;

      if (initialWord) {
        const keys = getLanguageCodesOrder();
        return keys.some((key) => initialWord[key] !== state.draftWord[key]);
      }
      return false;
    },
  },

  actions: {
    initDraftWord(word: Word | null = null) {
      if (word) {
        const _word = convertWordToDraftWord(word);

        this.draftWord = structuredClone(_word);
        this.initialWord = structuredClone(_word);
      } else {
        this.draftWord = _initDraftWord();
        this.initialWord = null;
      }
    },
    resetDraftWord() {
      this.initDraftWord();
    },
    resetTranslationApproved() {
      this.draftWord.translation_approved =
        this.initialWord?.translation_approved || false;
    },
    async autoFillTranslations() {
      const fields = await translate(this.draftWord);
      this.draftWord = {
        ...this.draftWord,
        ...fields,
      };
    },
  },
});
