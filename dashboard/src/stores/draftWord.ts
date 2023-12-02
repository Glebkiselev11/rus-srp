import type { DraftWord, Word } from "@/types/words";
import { defineStore } from "pinia";
import { isAnyFieldHasChanged } from "@/common/utils";
import { autoTranslate } from "@/common/translations";

function _initDraftWord(): DraftWord {
	return {
		id: undefined,
		rus: "",
		eng: "",
		srp_latin: "",
		srp_cyrillic: "",
		image: null,
	};
}

export const useDraftWordStore = defineStore("draftWord", {
	state: () => ({
		draftWord: _initDraftWord(),
		// if we are in editing mode, we need to store the initial word
		initialWord: null as Word | null,
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
			return this.translations.some(x => Boolean(x));
		},
		allTranslationsFilled(): boolean {
			return this.translations.every(x => Boolean(x));
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
	},

	actions: {
		initDraftWord(word: Word | null = null) {
			if (word) {
				this.draftWord = { ...word };
				this.initialWord = word;
			} else {
				this.draftWord = _initDraftWord();
				this.initialWord = null;
			}
		},
		resetDraftWord() {
			this.initDraftWord();
		},
		async autoFillTranslations() {
			const fields = await autoTranslate(this.draftWord);
			this.draftWord = {
				...this.draftWord,
				...fields,
			};
		},
	},

});
