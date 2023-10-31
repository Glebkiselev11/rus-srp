<script lang="ts">
import { defineComponent } from "vue";
import AppCategoryItem from "./AppCategoryItem.vue";
import AppListItem from "@/components/AppListItem.vue";
import AppAllWordsCategoryImage from "./AppAllWordsCategoryImage.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapState } from "pinia";
import AppZeroState from "../AppZeroState.vue";

export default defineComponent({
	name: "AppCategoriesList",
	components: {
		AppCategoryItem,
		AppListItem,
		AppAllWordsCategoryImage,
		AppZeroState,
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
	emits: ["selectCateogry"],
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
	},
});

</script>

<template>
	<div class="app-categories-list">
		<div class="app-categories-list__items">
			<AppListItem
				clickable
				size="compact"
				:selected="!selectedCategoryId"
				@click="selectCategory(0)"
			>
				<AppAllWordsCategoryImage size="24px" />

				<span class="text-body-2">{{ $t('all-words') }}</span>
			</AppListItem>
		</div>

		<hr>

		<div
			v-if="loadState === 'loaded' && count > 0"
			class="app-categories-list__items"
		>
			<AppCategoryItem
				v-for="category in categories"
				:key="category.id"
				:category="category"
				:selected="category.id === selectedCategoryId"
				:query="searchQuary"
				@select-cateogry="selectCategory"
			/>
		</div>

		<div
			v-if="loadState === 'loaded' && count === 0"
			class="app-categories-list__zero-state"
		>
			<AppZeroState
				icon="search"
				:title="notFoundTitle"
				:description="$t('not-found-description')"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">

.app-categories-list {
	&__items {
		margin-inline: 12px;
		margin-block: 12px;
		display: flex;
		flex-direction: column;
		row-gap: 4px;
	}

	&__zero-state {
		@extend .app-categories-list__items;	
		margin-block: 75%;
	}
}

</style>
