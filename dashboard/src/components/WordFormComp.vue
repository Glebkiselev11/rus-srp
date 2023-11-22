<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { DraftWord, Word } from "@/types/words";
import { getLanguageName, autoTranslate } from "@/common/translations";
import ImageSectionComp from "./ImageSectionComp.vue";
import ButtonComp from "./ButtonComp.vue";
import InputComp from "./InputComp.vue";
import { useWordsStore } from "@/stores/words";
import { mapActions } from "pinia";

export default defineComponent({
	name: "WordFormComp",
	components: { ImageSectionComp, ButtonComp, InputComp },
	props: {
		word: {
			type: Object as PropType<Word>,
			default: undefined,
		},
	},
	emits: ["close", "saved", "update-subtitle"],
	data() {
		return {
			draftWord: {
				rus: "",
				eng: "",
				srp_latin: "",
				srp_cyrillic: "",
				image: null,
			} as DraftWord,
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
		subtitle(): string {
			if (this.word || this.anyTranslationFilled) {
				return this.translations 
					.map(x => Boolean(x) ? x : " ? ")
					.join(" — ") as string;
			} else {
				return this.$t("new-word");
			}
		},
		anyTranslationFilled(): boolean {
			return this.translations.some(x => Boolean(x));
		},
		saveButtonLabel(): string {
			return this.word ? this.$t("save-changes") : this.$t("create");
		},
	},
	watch: {
		subtitle() {
			this.emitUpdateSubtitle();
		},
	},
	created() {
		if (this.word) {
			this.draftWord = { ...this.word };
		}

		this.emitUpdateSubtitle();
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
		async saveWord() {
			if (this.word) {
				await this.updateWord(this.word.id, this.draftWord);
			} else {
				await this.createWord(this.draftWord);
			}

			this.$emit("saved");
		},
		emitUpdateSubtitle() {
			this.$emit("update-subtitle", this.subtitle);
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
				<span class="text-body-2">{{ subtitle }}</span>
			</div>
		</ImageSectionComp>

		<div class="word-form__row">
			<h3>{{ $t('translation') }}</h3>

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
			disable-error-label
			clear-button
			:label="getLanguageName('rus')"
			class="word-form__translation-input"
		/>

		<InputComp
			v-model="draftWord.eng"
			appearance="outline"
			disable-error-label
			clear-button
			:label="getLanguageName('eng')"
			class="word-form__translation-input"
		/>

		<InputComp
			v-model="draftWord.srp_latin"
			appearance="outline"
			disable-error-label
			clear-button
			:label="getLanguageName('srp_latin')"
			class="word-form__translation-input"
		/>

		<InputComp
			v-model="draftWord.srp_cyrillic"
			appearance="outline"
			disable-error-label
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
