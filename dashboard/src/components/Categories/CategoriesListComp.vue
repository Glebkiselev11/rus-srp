<script lang="ts">
import { defineComponent } from "vue";
import CategoryItemComp from "./CategoryItemComp.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import AllWordsCategoryImageComp from "./AllWordsCategoryImageComp.vue";
import { usePageCategoriesStore } from "@/stores/categories/pageCategories";
import { mapState } from "pinia";
import ZeroStateComp from "../ZeroStateComp.vue";
import SkeletonItemComp from "../SkeletonItemComp.vue";

export default defineComponent({
	name: "CategoriesListComp",
	components: {
		CategoryItemComp,
		ListItemComp,
		AllWordsCategoryImageComp,
		ZeroStateComp,
		SkeletonItemComp,
	},
	props: {
		selectedCategoryId: {
			type: Number,
			default: undefined,
		},
		searchQuary: {
			type: String,
			default: "",
		},
	},
	emits: ["selectCateogry", "select-category-for-editing"],
	computed: {
		...mapState(usePageCategoriesStore, ["categories", "loadState", "count"]),
		notFoundTitle(): string {
			return this.$t("not-found", { search: this.searchQuary });
		},
	},
	methods: {
		selectCategory(categoryId: number) {
			if (categoryId === this.selectedCategoryId) return;
			this.$emit("selectCateogry", categoryId);
		},
		selectCategoryForEditing(categoryId: number) {
			this.$emit("select-category-for-editing", categoryId);
		},
	},
});

</script>

<template>
	<div class="categories-list">
		<div class="categories-list__items">
			<ListItemComp
				clickable
				size="compact"
				:selected="!selectedCategoryId"
				padding-inline="8px"
				@click="selectCategory(0)"
			>
				<div class="categories-list__all-words-item">
					<AllWordsCategoryImageComp size="24px" />

					<span>{{ $t('all-words') }}</span>
				</div>
			</ListItemComp>
		</div>

		<hr>

		<div
			v-if="loadState === 'loaded' && count > 0"
			class="categories-list__items"
		>
			<CategoryItemComp
				v-for="category in categories"
				:key="category.id"
				:category="category"
				:selected="category.id === selectedCategoryId"
				:query="searchQuary"
				@select-cateogry="selectCategory"
				@select-category-for-editing="selectCategoryForEditing"
			/>
		</div>

		<div
			v-else-if="loadState === 'loading'"
			class="categories-list__items"
		>
			<div 
				v-for="i in 15"
				:key="i"
				class="categories-list__skeleton-item"
			>
				<SkeletonItemComp
					height="24px"
					width="24px"
					border-radius="8px"
				/>				
				<SkeletonItemComp
					height="20px"
					random-width
					border-radius="4px"
				/>
			</div>
		</div>

		<div
			v-else-if="loadState === 'loaded' && count === 0"
			class="categories-list__zero-state"
		>
			<ZeroStateComp
				icon="search"
				:title="notFoundTitle"
				:description="$t('not-found-description')"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.categories-list {
	&__all-words-item {
		display: flex;
		align-items: center;
		column-gap: 8px;
		@include text-body-2;
	}

	&__items {
		padding: 12px;
		display: flex;
		flex-direction: column;
		row-gap: 4px;
		max-height: calc(100vh - 170px);
		overflow: auto;
	}

	&__skeleton-item {
		display: flex;
		align-items: center;
		column-gap: 8px;
		padding: 8px;
	}

	&__zero-state {
		@extend .categories-list__items;	
		margin-block: 75%;
	}
}

</style>
