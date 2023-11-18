<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { DraftWord, Word } from "@/types/words";
import { getLanguageName } from "@/common/translations";
import ImageSectionComp from "./ImageSectionComp.vue";
import ButtonComp from "./ButtonComp.vue";
import InputComp from "./InputComp.vue";

export default defineComponent({
	name: "WordFormComp",
	components: { ImageSectionComp, ButtonComp, InputComp },
	props: {
		word: {
			type: Object as PropType<Word>,
			default: undefined,
		},
	},
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
		subtitle(): string {
			if (this.word) {
				// eslint-disable-next-line max-len
				return `${this.draftWord.rus} - ${this.draftWord.eng} - ${this.draftWord.srp_latin} - ${this.draftWord.srp_cyrillic}`; 
			} else {
				return this.$t("new-word");
			}
		},
		showFillAutoButton(): boolean {
			return false;
		},
	},
	created() {
		if (this.word) {
			this.draftWord = { ...this.word };
		}
	},
	methods: {
		getLanguageName,
		autoFill() {
			console.log("autoFill");
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
				v-show="showFillAutoButton"
				icon="edit_note"
				appearance="inline"
				size="regular"
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
	}

	&__translation-input {
		margin-block: 20px;
	}
}

</style>
