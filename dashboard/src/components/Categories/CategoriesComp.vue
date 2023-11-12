<!-- The side bar with categories -->
<script lang="ts">
import { defineComponent } from "vue";
import ButtonComp from "@/components/ButtonComp.vue";
import { mapActions } from "pinia";
import { useCategoriesStore } from "@/stores/categories";
import AppInput from "@/components/AppInput.vue";
import CategoriesListComp from "@/components/Categories/CategoriesListComp.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppDropdownMenu from "../AppDropdownMenu.vue";
import type { Order, RequestParams } from "@/types/api";
import type { LanguageCode } from "@/types/translations";
import AppTooltip from "../AppTooltip.vue";
import CategoryFormModalComp from "../CategoryFormModalComp.vue";

export default defineComponent({
	name: "CategoriesComp",
	components: {
		AppInput,
		ButtonComp,
		CategoriesListComp,
		AppHeader,
		AppDropdownMenu,
		AppTooltip,
		CategoryFormModalComp,
	},
	props: {
		selectedCategoryId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["update:selected-category-id"],
	data() {
		return {
			showCategoryForm: false,
			editingCategoryId: undefined as number | undefined,
		};
	},
	computed: {
		filter: {
			get() {
				return {
					search: this.$route.query.search_category as string || "",
					order: this.$route.query.order_category as Order || "-created_at",
					offset: 0,
					limit: 20,
				};
			},
			set(params: RequestParams) {
				this.$router.push({
					query: {
						...this.$route.query,
						search_category: params.search,
						order_category: params.order,
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
		order: {
			get(): Order {
				return this.filter.order;
			},
			set(order: Order) {
				this.filter = { ...this.filter, order };
			},
		},
		orderOptions() {
			return [
				{ 
					label: this.$t("order.last-added"), 
					icon: "done", 
					color: this.getOrderColor("-created_at"),
					handler: () => this.order = "-created_at", 
				} as const,
				{ 
					label: this.$t("order.last-updated"), 
					color: this.getOrderColor("-updated_at"),
					icon: "done", 
					handler: () => this.order = "-updated_at", 
				} as const,
				"separator" as const,
				{ 
					label: this.$t("order.alphabetical-asc"), 
					color: this.getOrderColor(`${this.$i18n.locale as LanguageCode}`),
					icon: "done", 
					handler: () => this.order = `${this.$i18n.locale as LanguageCode}`, 
				} as const,
				{ 
					label: this.$t("order.alphabetical-desc"), 
					color: this.getOrderColor(`-${this.$i18n.locale as LanguageCode}`),
					icon: "done", 
					handler: () => this.order = `-${this.$i18n.locale as LanguageCode}`, 
				} as const,
			];
		},
	},
	mounted() {
		this.fetchCategories(this.filter);
	},
	methods: {
		...mapActions(useCategoriesStore, ["fetchCategories"]),
		openCreationCategoryForm() {
			this.editingCategoryId = undefined;
			this.showCategoryForm = true;
		},
		openEditingCategoryForm(categoryId: number) {
			this.editingCategoryId = categoryId;
			this.showCategoryForm = true;
		},
		selectCategory(categoryId: number) {
			this.$emit("update:selected-category-id", categoryId || undefined);
		},
		getOrderColor(key: Order) {
			return key === this.order ? "accent-primary" : "transparent";
		},
	},
});

</script>

<template>
	<div class="categories">
		<AppHeader
			:title="$t('categories')"
			title-tag="h4"
		>
			<template #right>
				<div class="categories__controls">
					<AppDropdownMenu 
						v-slot="{ isMenuOpen }"		
						:items="orderOptions"
					>
						<AppTooltip :text="$t('to-sort')">
							<ButtonComp 
								icon="sort"
								appearance="inline"
								color="neutral"
								:pressed="isMenuOpen"
							/>
						</AppTooltip>
					</AppDropdownMenu>

					<AppTooltip :text="$t('create-category')">
						<ButtonComp
							icon="add"
							appearance="inline"
							color="neutral"
							@click="openCreationCategoryForm"
						/>
					</AppTooltip>
				</div>
			</template>
		</AppHeader>

		<AppInput
			v-model="search"
			:placeholder="$t('find-category')"
			left-icon="search"
			debounce
			clear-button
			class="categories__search"
		/>

		<CategoriesListComp
			:selected-category-id="selectedCategoryId"
			:search-quary="search"
			@select-cateogry="selectCategory"
			@select-category-for-editing="openEditingCategoryForm"
		/>

		<CategoryFormModalComp
			v-if="showCategoryForm"
			:category-id="editingCategoryId"
			@close="showCategoryForm = false"
		/>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.categories {
  background-color: $color-background-content-primary;
  border-inline-end: 1px solid $color-separator-primary;

	&__controls {
		display: flex;
	}

	&__search {
		margin-inline: 12px;
		margin-block-end: 12px;
	}
}

</style>
