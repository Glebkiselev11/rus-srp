<script lang="ts">
import { defineComponent } from "vue";
import CategoryItemComp from "./CategoryItemComp.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import AllWordsCategoryImageComp from "./AllWordsCategoryImageComp.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapState } from "pinia";
import ZeroStateComp from "../ZeroStateComp.vue";

export default defineComponent({
	name: "CategoriesListComp",
	components: {
		CategoryItemComp,
		ListItemComp,
		AllWordsCategoryImageComp,
		ZeroStateComp,
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
		...mapState(useCategoriesStore, ["categories", "loadState", "count"]),
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

					<span class="text-body-2">{{ $t('all-words') }}</span>
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
			v-if="loadState === 'loaded' && count === 0"
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

.categories-list {
	&__all-words-item {
		display: flex;
		align-items: center;
		column-gap: 8px;
	}

	&__items {
		margin-inline: 12px;
		margin-block: 12px;
		display: flex;
		flex-direction: column;
		row-gap: 4px;
	}

	&__zero-state {
		@extend .categories-list__items;	
		margin-block: 75%;
	}
}

</style>
