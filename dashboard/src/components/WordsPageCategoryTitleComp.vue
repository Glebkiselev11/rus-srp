<script lang="ts">
import { defineComponent } from "vue";
import AllWordsCategoryImageComp from "./Categories/AllWordsCategoryImageComp.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions, mapState } from "pinia";
import type { Category } from "@/types/categories";
import type { LanguageCode } from "@/types/translations";
import AppImagePreview from "./AppImagePreview.vue";
import AppDropdownMenu from "./AppDropdownMenu.vue";
import ButtonComp from "./ButtonComp.vue";
import RemoveCategoryModalComp from "./Categories/RemoveCategoryModalComp.vue";
import CategoryFormModalComp from "./CategoryFormModalComp.vue";

export default defineComponent({
	name: "WordsPageCategoryTitleComp",
	components: {
		AllWordsCategoryImageComp,
		AppImagePreview,
		AppDropdownMenu,
		ButtonComp,
		RemoveCategoryModalComp, 
		CategoryFormModalComp,
	},
	props: {
		categoryId: {
			type: Number,
			default: undefined,
		},	
	},
	data() {
		return {
			isRemoveCategoryModalOpen: false,
			isEditCategoryModalOpen: false,
		};
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
		editCategory() {
			this.isEditCategoryModalOpen = true;
		},
		openRemoveCategoryModal() {
			this.isRemoveCategoryModalOpen = true;
		},
	},
});

</script>

<template>
	<div
		v-if="category"
		class="words-page-category-title"
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

		<AppDropdownMenu
			v-slot="{ isMenuOpen }"
			:items="[
				{ 
					label: $t('edit'),
					icon: 'edit',
					handler: editCategory
				},
				'separator',
				{ 
					label: $t('delete'), 
					icon: 'delete', 
					color: 'negative', 
					handler: openRemoveCategoryModal 
				}
			]"		
		>
			<ButtonComp
				icon="more_vert"
				appearance="inline"
				color="neutral"
				size="compact"
				class="words-page-category-title__menu-button"
				:pressed="isMenuOpen"
			/>
		</AppDropdownMenu>

		<RemoveCategoryModalComp
			v-if="isRemoveCategoryModalOpen"
			:category="category"
			@close="isRemoveCategoryModalOpen = false"
		/>

		<CategoryFormModalComp
			v-if="isEditCategoryModalOpen"
			:category-id="category.id"
			@close="isEditCategoryModalOpen = false"
		/>
	</div>

	<div
		v-else
		class="words-page-category-title"
	>
		<AllWordsCategoryImageComp size="56px" />
		<h2>
			{{ $t("all-words") }}
		</h2>
	</div>
</template>

<style scoped lang="scss">

.words-page-category-title {
	display: flex;
	align-items: center;
	gap: 12px;

	& > h2::first-letter {
		text-transform: uppercase;
	}

	&__menu-button {
		visibility: hidden;
	}
}

.words-page-category-title:hover, .app-dropdown--open {
		.words-page-category-title__menu-button {
			visibility: visible;
		}
	}

</style>
