<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import type { LanguageCode } from "@/i18n";

import AppImagePreview from "@/components/AppImagePreview.vue";
import AppListItem from "@/components/AppListItem.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions } from "pinia";
import { highlighTextByQuery } from "@/utils";
import AppButton from "../AppButton.vue";
import AppDropdownMenu from "../AppDropdownMenu.vue";

export default defineComponent({
	name: "AppCategoryItem",
	components: {
		AppImagePreview,
		AppListItem,
		AppButton,
		AppDropdownMenu,
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
	emits: ["selectCateogry", "selectCategoryForEditing"],
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
		editCategory(categoryId: number) {
			this.$emit("selectCategoryForEditing", categoryId);
		},
	},
});

</script>

<template>
	<AppListItem
		clickable
		:selected="selected"
		size="compact"
		padding-inline="8px"
		@click="selectCategory"
	>
		<div class="app-category-item">
			<div class="app-category-item__row">
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
			</div>

			<AppDropdownMenu 
				v-slot="{ isMenuOpen }"
				:items="[
					{ 
						label: $t('edit'),
						icon: 'edit',
						handler: () => editCategory(category.id)
					},
				]"		
				@click.stop
			>
				<AppButton
					icon="more_vert"
					type="inline"
					color="neutral"
					size="compact"
					:pressed="isMenuOpen"
				/>
			</AppDropdownMenu>
		</div>
	</AppListItem>
</template>

<style scoped lang="scss">

.app-category-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	&__row {
		display: inherit;
		align-items: inherit;
		column-gap: 12px;
	}

	&__label::first-letter {
		text-transform: uppercase;
	}
}

</style>
