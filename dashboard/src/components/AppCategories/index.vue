<!-- The side bar with categories -->
<script lang="ts">
import { defineComponent } from "vue";
import AppButton from "@/components/AppButton.vue";
import { mapActions, mapState } from "pinia";
import { useCategoriesStore } from "@/stores/categories";
import AppInput from "@/components/AppInput.vue";
import AppCategoriesList from "@/components/AppCategories/AppCategoriesList.vue";
import AppHeader from "@/components/AppHeader.vue";
import type { RequestParams } from "@/types/api";

export default defineComponent({
	name: "AppCategories",
	components: {
		AppInput,
		AppButton,
		AppCategoriesList,
		AppHeader,
	},
	props: {
		selectedCategoryId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["update:selected-category-id"],
	computed: {
		...mapState(useCategoriesStore, ["categories"]),
		filter: {
			get() {
				return {
					search: this.$route.query.search_category as string || "",
					offset: 0,
					limit: 20,
				};
			},
			set(params: RequestParams) {
				this.$router.push({
					query: {
						...this.$route.query,
						search_category: params.search,
					},
				}).then(() => {
					this.fetchCategories(params);
				});
			},
		},
		search: {
			get() {
				return this.filter.search;
			},
			set(search: string) {
				this.filter = { ...this.filter, search };
			},
		},

	},
	mounted() {
		this.fetchCategories(this.filter);
	},
	methods: {
		...mapActions(useCategoriesStore, ["fetchCategories"]),
		addCategory() {
			console.log("add category");
		},
		selectCategory(categoryId: number) {
			this.$emit("update:selected-category-id", categoryId || undefined);
		},
	},
});

</script>

<template>
	<div class="app-categories">
		<AppHeader
			:title="$t('categories')"
			title-tag="h4"
		>
			<template #right>
				<AppButton
					icon="add"
					size="compact"
					type="inline"
					color="neutral"
					@click="addCategory"
				/>
			</template>
		</AppHeader>

		<AppInput
			v-model="search"
			:placeholder="$t('find-category')"
			left-icon="search"
			debounce
			class="app-categories__search"
		/>

		<AppCategoriesList
			:categories="categories"
			:selected-category-id="selectedCategoryId"
			@select-cateogry="selectCategory"
		/>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-categories {
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;

	&__search {
		margin-inline: 12px;
		margin-block-end: 12px;
	}
}

</style>
