<script lang="ts">
import { defineComponent } from "vue";
import AppImagePreview from "./AppImagePreview.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapState } from "pinia";
import type { Category, DraftCategory } from "@/types/categories";
import { LanguageList, type LanguageCode } from "@/i18n";
import AppInput from "./AppInput.vue";

export default defineComponent({
	name: "AppCategoryForm",
	components: { AppImagePreview, AppInput },
	props: {
		categoryId: {
			type: Number,
			default: undefined,
		},
	},
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
	},
	created() {
		if (this.category) {
			this.draftCategory = { ...this.category };
		}
	},
	methods: {
		getLabelByKey(key: LanguageCode): string {
			return LanguageList.find(({ value }) => value === key)?.label || "Not found label";
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
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-category-form {
	padding-inline: 16px;
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
}
</style>
