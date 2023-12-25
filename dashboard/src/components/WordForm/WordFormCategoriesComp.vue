<script lang="ts">
import { defineComponent } from "vue";
import InputComp from "../InputComp.vue";
import ButtonComp from "../ButtonComp.vue";
import CategoryFormModalComp from "../CategoryFormModalComp.vue";
import WordFormCategoryItemComp from "./WordFormCategoryItemComp.vue";
import IconComp from "../IconComp/index.vue";
import TooltipComp from "../TooltipComp.vue";
import ZeroStateComp from "../ZeroStateComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { mapActions, mapState } from "pinia";
import type { Category } from "@/types/categories";
import { useModalCategoriesStore } from "@/stores/categories/modalCategories";
import type { Order } from "@/types/api";

export default defineComponent({
	name: "WordFormCategoriesComp",
	components: {
		InputComp,
		ButtonComp,
		IconComp,
		CategoryFormModalComp,
		WordFormCategoryItemComp,
		TooltipComp,
		ZeroStateComp,
	},
	data() {
		return {
			showCategoryForm: false,
			search: "",
		};
	},
	computed: {
		...mapState(useDraftWordStore, [
			"draftWord", 
		]),
		...mapState(useModalCategoriesStore, ["categories", "loadState"]),
		addedCategories(): Category[] {
			return this.draftWord.category_ids
				.map((id) => this.categories.find(x => x.id === id))
				.filter(Boolean) as Category[];
		},
		nonAddedCategories(): Category[] {
			return this.categories.filter(x => !this.draftWord.category_ids.includes(x.id));
		},
		nothingWereFound(): boolean {
			return (
				this.loadState === "loaded" && 
				!this.addedCategories.length && 
				!this.nonAddedCategories.length
			);
		},
		filter() {
			return {
				search: this.search,
				order: "-created_at" as Order,
				offset: 0,
				limit: 1000,
			};
		},
	},
	watch: {
		search() {
			this.fetchModalCategories(this.filter);
		},
	},
	mounted() {
		this.fetchModalCategories(this.filter);
	},
	methods: {
		...mapActions(useModalCategoriesStore, ["fetchModalCategories"]),
		addCategory(categoryId: number) {
			this.draftWord.category_ids.push(categoryId);
		},
		removeCategory(categoryId: number) {
			this.draftWord.category_ids = this.draftWord.category_ids.filter(x => x !== categoryId);
		},
	},
});

</script>

<template>
	<div class="word-form-categories">
		<div class="word-form-categories__row">
			<InputComp
				v-model="search"
				appearance="outline"
				clear-button
				debounce
				class="word-form-categories__search-input"
				:placeholder="$t('find-category')"
				left-icon="search"
			/>

			<ButtonComp
				icon="add"
				class="word-form-categories__create-category-button"
				appearance="inline"
				:label="$t('create-category')"
				@click="showCategoryForm = true"
			/>
		</div>

		<!-- Nothing were found -->
		<ZeroStateComp 
			v-if="nothingWereFound"
			icon="search"
			:title="$t('not-found', { search })"
			:description="$t('not-found-description')"
			class="word-form-categories__zero-state"
		/>

		<template v-else>
			<div class="word-form-categories__list">
				<WordFormCategoryItemComp
					v-for="category in addedCategories"
					:key="category.id"
					:query="search"
					:category="category"
					@select-cateogry="removeCategory"
				>
					<TooltipComp
						:text="$t('remove-from-category')"
						position="left"
					>
						<IconComp
							name="remove"
							size="compact"
							appearance="inline"
						/>
					</TooltipComp>
				</WordFormCategoryItemComp>
			</div>

			<span class="word-form-categories__caption">{{ $t('all-categories') }}</span>

			<div class="word-form-categories__list">
				<WordFormCategoryItemComp
					v-for="category in nonAddedCategories"
					:key="category.id"
					:query="search"
					:category="category"
					@select-cateogry="addCategory"
				>
					<TooltipComp
						:text="$t('add-to-category')"
						position="left"
					>
						<IconComp
							name="add"
							size="compact"
							appearance="inline"
						/>
					</TooltipComp>
				</WordFormCategoryItemComp>
			</div>
		</template>

		<CategoryFormModalComp
			v-if="showCategoryForm"
			@close="showCategoryForm = false"
		/>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.word-form-categories {
	&__row {
		display: flex;
		justify-content: space-between;
		column-gap: 8px;
	}

	&__search-input {
		flex-shrink: 1;
	}

	&__create-category-button {
		margin-inline-start: 16px;
		flex-shrink: 0;
	}

	&__caption {
		@include text-caption-1;
		color: $color-text-secondary;
		margin-inline-start: 8px;
	}

	&__list {
		margin-block-start: 16px;
		margin-block-end: 24px;
	}

	&__zero-state {
		margin-block-start: 160px;
	}
}

</style>
