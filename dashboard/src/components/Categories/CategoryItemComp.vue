<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import type { LanguageCode } from "@/types/translations";

import AppImagePreview from "@/components/AppImagePreview.vue";
import AppListItem from "@/components/AppListItem.vue";
import { highlighTextByQuery } from "@/common/utils";
import ButtonComp from "../ButtonComp.vue";
import DropdownMenuComp from "../DropdownMenuComp.vue";
import RemoveCategoryModalComp from "./RemoveCategoryModalComp.vue";

export default defineComponent({
	name: "CategoryItemComp",
	components: {
		AppImagePreview,
		AppListItem,
		ButtonComp,
		DropdownMenuComp,
		RemoveCategoryModalComp,
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
	data() {
		return {
			isRemoveCategoryModalOpen: false,
		};
	},
	methods: {
		highlighTextByQuery,
		extractCategoryPreview(category: Category) {
			return category[this.$i18n.locale as LanguageCode];
		},
		selectCategory() {
			if (this.selected) return;
			this.$emit("selectCateogry", this.category.id);
		},
		editCategory(categoryId: number) {
			this.$emit("selectCategoryForEditing", categoryId);
		},
		openRemoveCategoryModal() {
			this.isRemoveCategoryModalOpen = true;
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
		class="list-item"
		@click="selectCategory"
	>
		<div class="category-item">
			<div class="category-item__row">
				<AppImagePreview
					size="24px"
					:src="category.image"
					static
				/>

				<span
					class="category-item__label"
					v-html="highlighTextByQuery(extractCategoryPreview(category), query)"
				/>
			</div>

			<DropdownMenuComp
				v-slot="{ isMenuOpen }"
				:items="[
					{ 
						label: $t('edit'),
						icon: 'edit',
						handler: () => editCategory(category.id)
					},
					'separator',
					{ 
						label: $t('delete'), 
						icon: 'delete', 
						color: 'negative', 
						handler: openRemoveCategoryModal 
					}
				]"		
				@click.stop
			>
				<ButtonComp
					icon="more_vert"
					appearance="inline"
					color="neutral"
					size="small"
					class="category-item__menu-button"
					:pressed="isMenuOpen"
				/>
			</DropdownMenuComp>
		</div>
	</AppListItem>

	<RemoveCategoryModalComp
		v-if="isRemoveCategoryModalOpen"
		:category="category"
		@close="isRemoveCategoryModalOpen = false"
	/>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";
.category-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	&__row {
		display: inherit;
		align-items: inherit;
		column-gap: 8px;
	}

	&__label {
		@extend .text-body-2;
		&::first-letter {
			text-transform: uppercase;
		}
	}

	&__menu-button {
		visibility: hidden;
	}
}

.list-item:hover, .dropdown--open {
	.category-item__menu-button {
		visibility: visible;
	}
}

</style>
