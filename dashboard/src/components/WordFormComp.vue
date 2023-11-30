<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Word } from "@/types/words";
import { getLanguageName } from "@/common/translations";
import ImageSectionComp from "./ImageSectionComp.vue";
import ButtonComp from "./ButtonComp.vue";
import InputComp from "./InputComp.vue";
import { useWordsStore } from "@/stores/words";
import { mapActions, mapState } from "pinia";
import { WordsApi } from "@/api/words";
import { translationPreview } from "@/common/utils";
import { useDraftWordStore } from "@/stores/draftWord";

export default defineComponent({
	name: "WordFormComp",
	components: { ImageSectionComp, ButtonComp, InputComp },
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
			"anyTranslationFilled", 
			"allTranslationsFilled",
		]),
		wordPreview(): string {
			if (this.word || this.anyTranslationFilled) {
				return translationPreview(this.draftWord);
			} else {
				return this.$t("new-word");
			}
		},
		saveButtonLabel(): string {
			return this.word ? this.$t("save-changes") : this.$t("create");
		},
		isValidToSave(): boolean {
			return this.allTranslationsFilled && !this.uniqueWordError;
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

	},
	created() {
		this.initDraftWord(this.word);
	},
	methods: {
		...mapActions(useWordsStore, ["createWord", "updateWord"]),
		...mapActions(useDraftWordStore, [
			"initDraftWord", 
			"resetDraftWord", 
			"autoFillTranslations",
		]),
		getLanguageName,
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
	<div class="word-form">
		<ImageSectionComp
			:src="draftWord.image"
			:default-image-search-query="draftWord.eng"
			@update:src="draftWord.image = $event"
		>
			<div>
				<h4>{{ $t("image") }}</h4>

				<span class="text-body-2">{{ wordPreview }}</span>
			</div>
		</ImageSectionComp>

		<div class="word-form__row">
			<div>
				<h3>{{ $t('translation') }}</h3>

				<span
					v-if="uniqueWordError"
					class="text-color-negative text-body-2"
					v-text="$t('word-already-exists')"
				/>
			</div>

			<ButtonComp
				v-show="anyTranslationFilled"
				icon="edit_note"
				appearance="inline"
				size="compact"
				:label="$t('fill-in-auto')"
				@click="autoFillTranslations"
			/>
		</div>

		<InputComp
			v-model="draftWord.rus"
			appearance="outline"
			clear-button
			:error="rusValidationError"
			:label="getLanguageName('rus')"
			class="word-form__translation-input"
		/>

		<InputComp
			v-model="draftWord.eng"
			appearance="outline"
			:error="engValidationError"
			clear-button
			:label="getLanguageName('eng')"
			class="word-form__translation-input"
		/>

		<InputComp
			v-model="draftWord.srp_latin"
			appearance="outline"
			:error="srpLatinValidationError"
			clear-button
			:label="getLanguageName('srp_latin')"
			class="word-form__translation-input"
		/>

		<InputComp
			v-model="draftWord.srp_cyrillic"
			appearance="outline"
			:error="srpCyrillicValidationError"
			clear-button
			:label="getLanguageName('srp_cyrillic')"
			class="word-form__translation-input"
		/>

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
	padding-inline: 16px;
	padding-block-end: 20px;
	width: 580px;

	&__row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block: 20px;
		height: 32px;
	}

	&__translation-input {
		margin-block: 20px;
	}

	&__footer {
		display: flex;
		justify-content: flex-end;
		column-gap: 8px;
		padding-block-start: 16px;
	}
}

</style>
