<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import type { LanguageCode } from "@/i18n";

import AppImagePreview from "@/components/AppImagePreview.vue";
import AppListItem from "@/components/AppListItem.vue";

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
	},
	methods: {
		extractCategoryPreview(category: Category) {
			return category[this.$i18n.locale as LanguageCode];
		},
		updateCategoryImage(category: Category, src: string) {
			console.log(category, src);
		},
		selectCategory() {
			console.log(this.category.id);
		},
	},
});

</script>

<template>
	<AppListItem
		clickable
		@click="selectCategory"
	>
		<AppImagePreview
			size="24px"
			:src="category.image"
			:image-search-modal-subtitle="extractCategoryPreview(category)"
			:default-image-search-query="category.eng"
			@update:src="src => updateCategoryImage(category, src)"
		/>

		<span class="app-category-item__label">
			{{ extractCategoryPreview(category) }}
		</span>
	</AppListItem>
</template>

<style scoped lang="scss">

.app-category-item {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

</style>
