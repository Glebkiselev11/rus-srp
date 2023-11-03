<script lang="ts">
import { defineComponent } from "vue";
import AppAllWordsCategoryImage from "./AppCategories/AppAllWordsCategoryImage.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions, mapState } from "pinia";
import type { Category } from "@/types/categories";
import type { LanguageCode } from "@/i18n";
import AppImagePreview from "./AppImagePreview.vue";

export default defineComponent({
	name: "AppWordsPageCategoryTitle",
	components: {
		AppAllWordsCategoryImage,
		AppImagePreview,
	},
	props: {
		categoryId: {
			type: Number,
			default: undefined,
		},	
	},
	computed: {
		...mapState(useCategoriesStore, ["categories"]),
		category(): Category | undefined {
			return this.categories.find(category => category.id === this.categoryId);
		},	
	},
	methods: {
		...mapActions(useCategoriesStore, ["updateCategory"]),
		getCategoryName(category: Category) {
			return category[this.$i18n.locale as LanguageCode];
		},
		updateCategoryImage(src: string) {
			if (this.category && src) {
				this.updateCategory(this.category.id, {
					...this.category,
					image: src,
				});
			}
		},	
	},
});

</script>

<template>
	<div
		v-if="category"
		class="app-words-page-category-title"
	>
		<AppImagePreview
			size="56px"
			:src="category.image"
			:image-search-modal-subtitle="getCategoryName(category)"
			:default-image-search-query="category.eng"
			@update:src="src => updateCategoryImage(src)"
		/>
		<h2>
			{{ getCategoryName(category) }}
		</h2>
	</div>

	<div
		v-else
		class="app-words-page-category-title"
	>
		<AppAllWordsCategoryImage size="56px" />
		<h2>
			{{ $t("all-words") }}
		</h2>
	</div>
</template>

<style scoped lang="scss">

.app-words-page-category-title {
	display: flex;
	align-items: center;
	gap: 12px;

	& > h2::first-letter {
		text-transform: uppercase;
	}
}

</style>
