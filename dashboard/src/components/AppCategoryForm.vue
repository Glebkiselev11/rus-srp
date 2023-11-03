<script lang="ts">
import { defineComponent } from "vue";
import AppImagePreview from "./AppImagePreview.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions, mapState } from "pinia";
import type { Category, DraftCategory } from "@/types/categories";
import { LanguageList, type LanguageCode } from "@/i18n";
import AppInput from "./AppInput.vue";
import AppButton from "./AppButton.vue";

export default defineComponent({
	name: "AppCategoryForm",
	components: { AppImagePreview, AppInput, AppButton },
	props: {
		categoryId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["saved"],
	data() {
		return {
			draftCategory: {
				rus: "",
				eng: "",
				srp_latin: "",
				srp_cyrillic: "",
				image: null,
			} as DraftCategory,
		};
	},
	computed: {
		...mapState(useCategoriesStore, ["getCategoryById"]),
		category(): Category | undefined {
			return this.categoryId ? this.getCategoryById(this.categoryId) : undefined;
		},
		selectedLanguage(): LanguageCode {
			return this.$i18n.locale as LanguageCode;
		},
		categoryName(): string {
			return this.draftCategory[this.selectedLanguage];
		},	
		defaultImageSearchQuery(): string {
			return this.draftCategory.eng;
		},
		saveButtonLabel(): string {
			return this.categoryId ? this.$t("save-changes") : this.$t("create");
		},
	},
	created() {
		if (this.category) {
			this.draftCategory = { ...this.category };
		}
	},
	methods: {
		...mapActions(useCategoriesStore, ["createCategory", "updateCategory"]),
		getLabelByKey(key: LanguageCode): string {
			return LanguageList.find(({ value }) => value === key)?.label || "Not found label";
		},
		async saveCategory() {
			if (this.category) {
				await this.updateCategory(this.category.id, this.draftCategory);
			} else {
				await this.createCategory(this.draftCategory);
			}

			this.$emit("saved");
		},
	},

});
</script>

<template>
	<div class="app-category-form">
		<div class="app-category-form__preview">
			<AppImagePreview
				size="96px"
				:src="draftCategory.image"
				:image-search-modal-subtitle="categoryName"
				:default-image-search-query="defaultImageSearchQuery"
				@update:src="draftCategory.image = $event"
			/>

			<AppInput
				v-model="draftCategory[selectedLanguage]"
				:label="getLabelByKey(selectedLanguage)"
				width="400px"
			/>
		</div>

		<h4 class="app-category-form__subtitle">
			{{ $t("translation") }}
		</h4>

		<AppInput
			v-if="selectedLanguage !== 'rus'"
			v-model="draftCategory.rus"
			:label="getLabelByKey('rus')"
			class="app-category-form__translation-input"
		/>

		<AppInput
			v-if="selectedLanguage !== 'eng'"
			v-model="draftCategory.eng"
			:label="getLabelByKey('eng')"
			class="app-category-form__translation-input"
		/>

		<AppInput
			v-if="selectedLanguage !== 'srp_latin'"
			v-model="draftCategory.srp_latin"
			:label="getLabelByKey('srp_latin')"
			class="app-category-form__translation-input"
		/>

		<AppInput
			v-if="selectedLanguage !== 'srp_cyrillic'"
			v-model="draftCategory.srp_cyrillic"
			:label="getLabelByKey('srp_cyrillic')"
			class="app-category-form__translation-input"
		/>

		<div class="app-category-form__footer">
			<AppButton
				type="secondary"
				:label="$t('cancel')"	
			/>
			<AppButton
				:label="saveButtonLabel"
				@click="saveCategory"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-category-form {
	padding-inline: 16px;
	padding-block-end: 20px;
	width: 598px;

	&__preview {
		display: flex;
		column-gap: 24px;
		width: 100%;
		height: 144px;
		padding: 24px;
		background: $color-background;
		border-radius: 16px;
	}

	&__subtitle {
		margin-block-start: 24px;
		margin-block-end: 28px;
	}
	
	&__translation-input {
		margin-block-end: 24px;
	}

	&__footer {
		display: flex;
		justify-content: flex-end;
		column-gap: 8px;
		padding-block-start: 16px;
	}
}
</style>
