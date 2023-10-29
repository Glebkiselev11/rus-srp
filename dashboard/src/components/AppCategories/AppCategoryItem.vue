<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import type { LanguageCode } from "@/i18n";

import AppImagePreview from "@/components/AppImagePreview.vue";
import AppListItem from "@/components/AppListItem.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions } from "pinia";
import { highlighTextByQuery } from "@/utils";

export default defineComponent({
	name: "AppCategoryItem",
	components: {
		AppImagePreview,
		AppListItem,
	},
	props: {
		category: {
			type: Object as PropType<Category>,
			required: true,
		},
		selected: {
			type: Boolean,
			default: false,
		},
		query: {
			type: String,
			default: "",
		},
	},
	emits: ["selectCateogry"],
	methods: {
		...mapActions(useCategoriesStore, ["updateCategory"]),
		highlighTextByQuery,
		extractCategoryPreview(category: Category) {
			return category[this.$i18n.locale as LanguageCode];
		},
		updateCategoryImage(category: Category, src: string) {
			this.updateCategory({
				...category,
				image: src,
			});
		},
		selectCategory() {
			if (this.selected) return;
			this.$emit("selectCateogry", this.category.id);
		},
	},
});

</script>

<template>
	<AppListItem
		clickable
		:selected="selected"
		size="compact"
		@click="selectCategory"
	>
		<AppImagePreview
			size="24px"
			:src="category.image"
			:image-search-modal-subtitle="extractCategoryPreview(category)"
			:default-image-search-query="category.eng"
			@update:src="src => updateCategoryImage(category, src)"
		/>

		<span
			class="app-category-item__label"
			v-html="highlighTextByQuery(extractCategoryPreview(category), query)"
		/>
	</AppListItem>
</template>

<style scoped lang="scss">

.app-category-item {
  display: flex;
  align-items: center;
  column-gap: 4px;

	&__label::first-letter {
		text-transform: uppercase;
	}
}

</style>
