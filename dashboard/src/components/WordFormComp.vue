<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { DraftWord, Word } from "@/types/words";
import { getLanguageName, autoTranslate } from "@/common/translations";
import ImageSectionComp from "./ImageSectionComp.vue";
import ButtonComp from "./ButtonComp.vue";
import InputComp from "./InputComp.vue";
import { useWordsStore } from "@/stores/words";
import { mapActions } from "pinia";
import { WordsApi } from "@/api/words";

export default defineComponent({
	name: "WordFormComp",
	components: { ImageSectionComp, ButtonComp, InputComp },
	props: {
		word: {
			type: Object as PropType<Word>,
			default: undefined,
		},
	},
	emits: ["close", "saved", "update-modal-subtitle"],
	data() {
		return {
			draftWord: {
				rus: "",
				eng: "",
				srp_latin: "",
				srp_cyrillic: "",
				image: null,
			} as DraftWord,
			uniqueWordError: false,
			rusValidationError: undefined as string | undefined,
			engValidationError: undefined as string | undefined,
			srpLatinValidationError: undefined as string | undefined,
			srpCyrillicValidationError: undefined as string | undefined,
		};
	},
	computed: {
		translations(): string[]  {
			return [
				this.draftWord.rus,
				this.draftWord.eng,
				this.draftWord.srp_latin,
				this.draftWord.srp_cyrillic,
			];
		},
		wordPreview(): string {
			if (this.word || this.anyTranslationFilled) {
				return this.getWordPreview(this.draftWord);
			} else {
				return this.$t("new-word");
			}
		},
		modalSubtitle(): string {
			if (this.word) {
				return this.getWordPreview(this.word);
			} else if (this.anyTranslationFilled) {
				return this.getWordPreview(this.draftWord);
			} else {
				return this.$t("new-word");
			}
		},
		anyTranslationFilled(): boolean {
			return this.translations.some(x => Boolean(x));
		},
		allTranslationsFilled(): boolean {
			return this.translations.every(x => Boolean(x));
		},
		saveButtonLabel(): string {
			return this.word ? this.$t("save-changes") : this.$t("create");
		},
		isValidToSave(): boolean {
			return this.allTranslationsFilled && !this.uniqueWordError;
		},
	},
	watch: {
		modalSubtitle() {
			this.emitUpdateModalSubtitle();
		},
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
		if (this.word) {
			this.draftWord = { ...this.word };
		}

		this.emitUpdateModalSubtitle();
	},
	methods: {
		...mapActions(useWordsStore, ["createWord", "updateWord"]),
		getLanguageName,
		autoTranslate,
		async autoFill() {
			const fields = await this.autoTranslate(this.draftWord);
			this.draftWord = {
				...this.draftWord,
				...fields,
			};
		},
		close() {
			this.$emit("close");
		},
		getWordPreview(word: Word | DraftWord) {
			return [
				word.rus,
				word.eng,
				word.srp_latin,
				word.srp_cyrillic]
				.map(x => Boolean(x) ? x : " ? ")
				.join(" — ");
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
		async saveWord() {
			await this.triggerValidation();

			if (!this.isValidToSave) return;

			if (this.word) {
				await this.updateWord(this.word.id, this.draftWord);
			} else {
				await this.createWord(this.draftWord);
			}

			this.$emit("saved");
		},
		emitUpdateModalSubtitle() {
			this.$emit("update-modal-subtitle", this.modalSubtitle);
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
				@click="autoFill"
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
				:label="saveButtonLabel"
				@click="saveWord"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.word-form {
	padding-inline: 16px;
	padding-block-end: 20px;
	width: 598px;

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
