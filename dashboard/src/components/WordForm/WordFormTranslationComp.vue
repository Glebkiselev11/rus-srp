<script lang="ts">
import { defineComponent } from "vue";
import ImageSectionComp from "../ImageSectionComp.vue";
import InputComp from "../InputComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { mapActions, mapState } from "pinia";
import { getLanguageLabel, translationPreview } from "@/common/translations";
import ButtonComp from "../ButtonComp.vue";

export default defineComponent({
	name: "WordFormTranslationComp",
	components: { ImageSectionComp, InputComp, ButtonComp },
	props: {
		uniqueWordError: {
			type: Boolean,
			default: false,
		},
		rusValidationError: {
			type: String,
			default: undefined,
		},
		engValidationError: {
			type: String,
			default: undefined,
		},
		srpLatinValidationError: {
			type: String,
			default: undefined,
		},
		srpCyrillicValidationError: {
			type: String,
			default: undefined,
		},
	},
	computed: {
		...mapState(useDraftWordStore, [
			"draftWord", 
			"anyTranslationFilled", 
			"semifilledTranslations",
			"allTranslationsFilled",
			"isEditMode",
		]),
		wordPreview(): string {
			if (this.isEditMode || this.anyTranslationFilled) {
				return translationPreview(this.draftWord);
			} else {
				return this.$t("new-word");
			}
		},
	},
	methods: {
		...mapActions(useDraftWordStore, [
			"autoFillTranslations",
		]),
		getLanguageLabel,
	},
});

</script>

<template>
	<div class="word-form-translation">
		<ImageSectionComp
			:src="draftWord.image"
			:default-image-search-query="draftWord.eng"
			@update:src="draftWord.image = $event"
		>
			<div>
				<h4>{{ $t("image") }}</h4>

				<span>{{ wordPreview }}</span>
			</div>
		</ImageSectionComp>

		<div class="word-form-translation__row">
			<div>
				<h3>{{ $t('translation') }}</h3>

				<span
					v-if="uniqueWordError"
					class="text-color-negative"
					v-text="$t('word-already-exists')"
				/>
			</div>

			<ButtonComp
				v-show="semifilledTranslations"
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
			:label="getLanguageLabel('rus')"
			class="word-form-translation__input"
		/>

		<InputComp
			v-model="draftWord.eng"
			appearance="outline"
			:error="engValidationError"
			clear-button
			:label="getLanguageLabel('eng')"
			class="word-form-translation__input"
		/>

		<InputComp
			v-model="draftWord.srp_latin"
			appearance="outline"
			:error="srpLatinValidationError"
			clear-button
			:label="getLanguageLabel('srp_latin')"
			class="word-form-translation__input"
		/>

		<InputComp
			v-model="draftWord.srp_cyrillic"
			appearance="outline"
			:error="srpCyrillicValidationError"
			clear-button
			:label="getLanguageLabel('srp_cyrillic')"
			class="word-form-translation__input"
		/>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.word-form-translation {
	@include text-body-2;

	&__tabs {
		margin-block-end: 20px;
	}

	&__row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-block: 20px;
		height: 32px;
	}

	&__input {
		margin-block: 20px;
	}
}

</style>
