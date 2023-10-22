<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import AppCategoryItem from "./AppCategoryItem.vue";
import AppListItem from "@/components/AppListItem.vue";
import AppAllWordsCategoryImage from "./AppAllWordsCategoryImage.vue";

export default defineComponent({
	name: "AppCategoriesList",
	components: {
		AppCategoryItem,
		AppListItem,
		AppAllWordsCategoryImage,
	},
	props: {
		categories: {
			type: Array as PropType<Array<Category>>,
			required: true,
		},
		selectedCategoryId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["selectCateogry"],
	methods: {
		selectCategory(categoryId: number) {
			if (categoryId === this.selectedCategoryId) return;
			this.$emit("selectCateogry", categoryId);
		},
	},
});

</script>

<template>
	<div class="app-categories-list">
		<div class="app-categories-list__item">
			<AppListItem
				clickable
				@click="selectCategory(0)"
			>
				<AppAllWordsCategoryImage size="24px" />

				<span class="text-body-2">{{ $t('all-words') }}</span>
			</AppListItem>
		</div>

		<hr>

		<div class="app-categories-list__item">
			<AppCategoryItem
				v-for="category in categories"
				:key="category.id"
				:category="category"
				:selected="category.id === selectedCategoryId"
				@select-cateogry="selectCategory"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">

.app-categories-list {
	&__item {
		margin-inline: 12px;
	}
}

</style>
