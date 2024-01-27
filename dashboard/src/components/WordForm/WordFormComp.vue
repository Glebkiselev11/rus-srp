<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Word } from "@/types/words";
import ButtonComp from "../ButtonComp.vue";
import TabsComp from "../TabsComp.vue";
import WordFormTranslationComp from "./WordFormTranslationComp.vue";
import WordFormCategoriesComp from "./WordFormCategoriesComp.vue";
import { useWordsActionsStore } from "@/stores/words/actions";
import { mapActions, mapState } from "pinia";
import { WordsApi } from "@/api/words";
import { useDraftWordStore } from "@/stores/draftWord";
import { useWordFormTabsStore } from "@/stores/wordFormTabs";

export default defineComponent({
	name: "WordFormComp",
	components: { 
		ButtonComp, 
		TabsComp, 
		WordFormTranslationComp,
		WordFormCategoriesComp,
	},
	props: {
		word: {
			type: Object as PropType<Word>,
			default: undefined,
		},
	},
	emits: ["close", "saved"],
	data() {
		return {
			uniqueWordError: false,
			rusValidationError: undefined as string | undefined,
			engValidationError: undefined as string | undefined,
			srpLatinValidationError: undefined as string | undefined,
			srpCyrillicValidationError: undefined as string | undefined,
		};
	},
	computed: {
		...mapState(useDraftWordStore, [
			"draftWord", 
			"allTranslationsFilled",
		]),
		...mapState(useWordFormTabsStore, [
			"tabs", 
			"currentTabIndex", 
			"isCategoriesTabOpen", 
			"isTranslationsTabOpen",
		]),
		saveButtonLabel(): string {
			return this.word ? this.$t("save-changes") : this.$t("create");
		},
		isValidToSave(): boolean {
			return this.allTranslationsFilled && !this.uniqueWordError;
		},
		anyTranslationError(){
			return Boolean(
				this.rusValidationError || 
				this.engValidationError || 
				this.srpLatinValidationError || 
				this.srpCyrillicValidationError || 
				this.uniqueWordError,
			);
		},
	},
	watch: {
		["draftWord.rus"]() {
			this.rusValidationError = undefined;
			this.uniqueWordError = false;
		},
		["draftWord.eng"]() {
			this.engValidationError = undefined;
			this.uniqueWordError = false;
		},
		["draftWord.srp_latin"]() {
			this.srpLatinValidationError = undefined;
			this.uniqueWordError = false;
		},
		["draftWord.srp_cyrillic"]() {
			this.srpCyrillicValidationError = undefined;
			this.uniqueWordError = false;
		},
		anyTranslationError(state) {
			this.setTranslationsTabError(state);
		},
	},
	created() {
		this.initDraftWord(this.word);
	},
	methods: {
		...mapActions(useWordsActionsStore, ["createWord", "updateWord"]),
		...mapActions(useDraftWordStore, [
			"initDraftWord", 
			"resetDraftWord", 
		]),
		...mapActions(useWordFormTabsStore, ["setCurrentTabIndex", "setTranslationsTabError"]),
		close() {
			this.$emit("close");
		},
		async triggerWordNameUniqueValidation() {
			const search = this.draftWord.eng;

			if (!search) {
				this.uniqueWordError = false;
				return;
			}

			const { data } = await WordsApi.query({ search });

			const exists = data.result.find(({ eng, rus, srp_cyrillic, srp_latin }) => {
				return (
					eng === this.draftWord.eng.toLocaleLowerCase() &&
					rus === this.draftWord.rus.toLocaleLowerCase() &&
					srp_cyrillic === this.draftWord.srp_cyrillic.toLocaleLowerCase() &&
					srp_latin === this.draftWord.srp_latin.toLocaleLowerCase()
				);
			});

			// If word exists and it's the same word we are editing
			// so we are fine
			if (this.word?.id === exists?.id) {
				this.uniqueWordError = false;
				return;
			}

			if (exists) {
				this.uniqueWordError = true;
			} else {
				this.uniqueWordError = false;
			}

		},
		async triggerValidation() {
			const checkFieldPresence = (x: string) => x ? undefined : this.$t("required");

			this.rusValidationError = checkFieldPresence(this.draftWord.rus);
			this.engValidationError = checkFieldPresence(this.draftWord.eng);
			this.srpCyrillicValidationError = checkFieldPresence(this.draftWord.srp_cyrillic);
			this.srpLatinValidationError = checkFieldPresence(this.draftWord.srp_latin);
			
			await this.triggerWordNameUniqueValidation();
		},
		async saveWord(resetAfterSave = false) {
			await this.triggerValidation();

			if (!this.isValidToSave) return;

			if (this.word) {
				await this.updateWord(this.word.id, this.draftWord);
			} else {
				await this.createWord(this.draftWord);
			}

			if (resetAfterSave) {
				this.resetDraftWord();
			} else {
				this.$emit("saved");
			}
		},
	},
});

</script>

<template>
	<TabsComp 
		:tabs="tabs" 
		padding-inline="16px"
		:selected-tab-index="currentTabIndex"		
		class="word-form__tabs"
		@update:selected-tab-index="setCurrentTabIndex"
	/>

	<div class="word-form">
		<div class="word-form__content">
			<WordFormTranslationComp
				v-show="isTranslationsTabOpen"
				:unique-word-error="uniqueWordError"
				:rus-validation-error="rusValidationError"
				:eng-validation-error="engValidationError"
				:srp-cyrillic-validation-error="srpCyrillicValidationError"
				:srp-latin-validation-error="srpLatinValidationError"
			/>
		
			<WordFormCategoriesComp v-show="isCategoriesTabOpen" />
		</div>

		<div class="word-form__footer">
			<ButtonComp
				appearance="secondary"
				:label="$t('cancel')"	
				@click="close"
			/>

			<ButtonComp
				v-if="!word"
				appearance="primary"
				:label="$t('create-and-add-next')"
				color="accent-secondary"
				@click="saveWord(true)"
			/>

			<ButtonComp
				:label="saveButtonLabel"
				@click="saveWord()"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.word-form {
	width: 596px;
	max-height: 660px;

	&__content {
		padding-block-start: 20px;
		padding-inline: 16px;
		height: 580px;
		overflow-y: auto;
		border-block-end: 1px solid $color-separator-primary;
	}

	&__footer {
		display: flex;
		justify-content: flex-end;
		column-gap: 8px;
		padding-inline: 16px;
		padding-block: 20px;
	}
}

</style>
