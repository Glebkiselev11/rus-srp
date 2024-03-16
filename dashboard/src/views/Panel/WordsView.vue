<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useWordsActionsStore } from "@/stores/words/actions";
import { usePageWordsStore } from "@/stores/words/pageWords";
import type { Id, Order, RequestParams } from "@/types/api";

import CategoriesComp from "@/components/Categories/CategoriesComp.vue";
import TopBarComp from "@/components/TopBarComp.vue";
import TableComp from "@/components/Table/TableComp.vue";
import TableRowComp from "@/components/Table/TableRowComp.vue";
import ImagePreviewComp from "@/components/ImagePreviewComp.vue";
import ButtonComp from "@/components/ButtonComp.vue";
import DropdownMenuComp from "@/components/DropdownMenuComp.vue";
import PaginationBarComp from "@/components/Pagination/PaginationBarComp.vue";
import ZeroStateComp from "@/components/ZeroStateComp.vue";
import WordsPageCategoryTitleComp from "@/components/WordsPageCategoryTitleComp.vue";
import CategoriesPreviewBadgesComp from "@/components/CategoriesPreviewBadgesComp.vue";
import SkeletonItemComp from "@/components/SkeletonItemComp.vue";
// eslint-disable-next-line max-len
import CategoryWordsInsertModalComp from "@/components/CategoryWordsInsert/CategoryWordsInsertModalComp.vue";
import { highlighTextByQuery } from "@/common/utils";

import type { Word } from "@/types/words";
import type { LanguageCode } from "@/types/translations";
import WordFormModalComp from "@/components/WordForm/WordFormModalComp.vue";
import { getLanguageCodesOrder, getLanguageLabel, translationPreview } from "@/common/translations";
import { useWordFormTabsStore } from "@/stores/wordFormTabs";
import TableRowStatusComp from "@/components/Table/TableRowStatusComp.vue";
import WordsViewFilterPanelComp from "@/components/WordsView/WordsViewFilterPanelComp.vue";

const LIMIT_DEFAULT = 25;

export default defineComponent({
	name: "WordsView",
	components: {
		TopBarComp,
		TableComp,
		TableRowComp,
		ImagePreviewComp,
		ButtonComp,
		DropdownMenuComp,
		PaginationBarComp,
		ZeroStateComp,
		CategoriesComp,
		WordsPageCategoryTitleComp,
		WordFormModalComp,
		CategoriesPreviewBadgesComp,
		CategoryWordsInsertModalComp,
		SkeletonItemComp,
		TableRowStatusComp,
		WordsViewFilterPanelComp,
	},
	data() {
		return {
			limitOptions: [
				{ value: LIMIT_DEFAULT, label: String(LIMIT_DEFAULT) },
				{ value: 50, label: "50" },
				{ value: 100, label: "100" },
			],
			orderOptions: [
				{ value: "-created_at", label: this.$t("order.last-added") },
				{ value: "-updated_at", label: this.$t("order.last-updated") },
			],
			defaultFilter: {
				search: "",
				offset: 0,
				limit: LIMIT_DEFAULT,
				order: "-created_at" as Order,
				category_id: undefined,
			},
			showWordForm: false,
			showCategoryWordsInsertModal: false,
			editingWordId: undefined as Id | undefined,
			hoverOnWordId: undefined as Id | undefined,
		};
	},
	computed: {
		...mapState(usePageWordsStore, ["words", "count", "loadState"]),
		translationColumns() {
			return getLanguageCodesOrder()
				.map((code) => ({
					label: getLanguageLabel(code),
					sortable: true,
					sort_key: code,
					width: "148px",
				}));
		},
		columns() {
			return [
				{
					sortable: false,
					width: "12px",
				},
				{ 
					sortable: true, 
					sort_key: "image", 
					icon: { 
						name: "image", 
						color: "tertiary", 
					} as const, 
					width: "100px", 
				},
				...this.translationColumns,
				{ 
					sortable: true, 
					sort_key: "category_count", 
					width: "338px", 
					label: this.$t("categories"), 
				},
				{ sortable: false, width: "auto" },
			];
		},
		gridTemplateColumns() {
			return this.columns
				.map((col) => col.width ?? "auto")
				.join(" ");
		},
		filter: {
			get(): RequestParams {
				const { search, offset, limit, order, category_id } = this.defaultFilter;
				return {
					search: this.$route.query.search_word as string || search,
					offset: Number(this.$route.query.offset) || offset,
					limit: Number(this.$route.query.limit) || limit,
					order: (this.$route.query.order_word) as Order || order,
					category_id: Number(this.$route.query.category_id) || category_id,
				};
			},
			set(params: RequestParams) {
				this.$router.push({
					query: {
						...this.$route.query,
						search_word: params.search,
						offset: params.offset,
						limit: params.limit,
						order_word: params.order,
						category_id: params.category_id,
					},
				}).then(() => {
					this.fetchPageWords(params);
				});
			},
		},
		search: {
			get(): string {
				return this.filter.search;
			},
			set(search: string) {
				const { category_id } = this.filter;
				this.filter = { 
					...this.defaultFilter, 
					category_id,
					search, 
				};
			},
		},
		limit: {
			get(): number {
				return this.filter.limit;
			},
			set(limit: number) {
				this.filter = { ...this.filter, limit, offset: 0 };
			},
		},
		offset: {
			get(): number {
				return this.filter.offset;
			},
			set(offset: number) {
				this.filter = { ...this.filter, offset };
			},
		},
		order: {
			get(): Order {
				return this.filter.order || "-created_at";
			},
			set(order: Order) {
				this.filter = { ...this.filter, order };
			},
		},
		category_id: {
			get(): number | undefined {
				return this.filter.category_id;
			},
			set(category_id: number | undefined) {
				this.filter = { ...this.defaultFilter, category_id };
			},
		},
		notFoundTitle(): string {
			return this.$t("not-found", { search: this.search });
		},
		showAddToCategoryButton(): boolean {
			return this.filter.category_id !== undefined;
		},
		showPagination(): boolean {
			return this.count > this.limit;
		},
		tableHeight(): string {
			const HeaderAndPanelHeight = "154px";

			return `calc(100vh - ${HeaderAndPanelHeight})`;
		},
	},
	mounted() {
		this.fetchPageWords(this.filter);
	},
	methods: {
		...mapActions(useWordsActionsStore, ["deleteWord", "updateWord"]),
		...mapActions(usePageWordsStore, ["fetchPageWords"]),
		...mapActions(useWordFormTabsStore, ["setCurrentTabToCategories"]),
		highlighTextByQuery,
		translationPreview,
		updateOrder(order: Order) {
			this.filter = { ...this.filter, order };
		},
		openCreationWordForm() {
			this.editingWordId = undefined;
			this.showWordForm = true;
		},
		async removeWord(word: Word) {
			const key = this.$i18n.locale as LanguageCode;

			if (confirm(this.$t("are-you-sure-delete", { word: word[key] }))) {
				this.deleteWord(word.id);
			}
		},
		openEditingWordForm(id: Id) {
			this.editingWordId = id;
			this.showWordForm = true;
		},
		openEditingWordFormOnCategoriesTab(id: Id) {
			this.openEditingWordForm(id);
			this.setCurrentTabToCategories();
		},
		openWordsListModal() {
			this.showCategoryWordsInsertModal = true;
		},
		updateWordImage(word: Word, src: string) {
			this.updateWord(word.id, { ...word, image: src });
		},
		setHoveredWordId(id: Id, hovered: boolean) {
			this.hoverOnWordId = hovered ? id : undefined;
		},
		refetch() {
			this.fetchPageWords(this.filter);
		},
		confirmTranslation(word: Word) {
			this.updateWord(word.id, { ...word, translation_approved: true });
		},
	},
});
</script>

<template>
	<div class="words-view">
		<CategoriesComp 
			:selected-category-id="filter.category_id"
			@update:selected-category-id="category_id = $event"
		/>

		<div>
			<TopBarComp>
				<template #left>
					<WordsPageCategoryTitleComp :category-id="filter.category_id" />
				</template>
				<template #right>
					<ButtonComp
						v-show="showAddToCategoryButton"
						:label="$t('add-to-category')"
						appearance="inline"
						class="words-view__add-to-category-button"
						@click="openWordsListModal"
					/>
					<ButtonComp
						icon="add"
						:label="$t('create-word')"
						@click="openCreationWordForm"
					/>
				</template>
			</TopBarComp>

			<div class="words-view__content">
				<WordsViewFilterPanelComp
					v-model:search="search"
					v-model:order="order"
					:order-options="orderOptions"
				/>

				<TableComp
					:columns="columns"
					:order="filter.order"
					:grid-template-columns="gridTemplateColumns"
					:table-height="tableHeight"
					@update:order="updateOrder"
				>
					<template
						v-if="words.length && loadState === 'loaded'"
						#body
					>
						<TableRowComp
							v-for="word in words"
							:id="word.id"
							:key="word.id"
							:grid-template-columns="gridTemplateColumns"	
							@hover="setHoveredWordId(word.id, $event)"
						>
							<TableRowStatusComp
								:active="!word.translation_approved"
								:disabled="word.translation_approved"
							>
								<div class="translation-confirmation-modal">
									<span 
										class="translation-confirmation-modal__title"
										v-text="$t('translation-not-confirmed')"
									/>

									<div class="translation-confirmation-modal__buttons">
										<ButtonComp 
											:label="$t('confirm')"
											appearance="secondary"
											@click="confirmTranslation(word)"
										/>
										<ButtonComp 
											:label="$t('edit')"
											appearance="secondary"
											icon="edit"
											@click="openEditingWordForm(word.id)"
										/>
									</div>
								</div>
							</TableRowStatusComp>

							<td>
								<ImagePreviewComp
									:src="word.image"
									:image-search-modal-subtitle="translationPreview(word)"
									:default-image-search-query="word.eng"
									@update:src="src => updateWordImage(word, src)"
								/>
							</td>

							<td
								v-for="(translation, i) in translationColumns"
								:key="`${word.id}-${i}`"
								v-html="highlighTextByQuery(word[translation.sort_key], search)"
							/>

							<td>
								<CategoriesPreviewBadgesComp
									:categories="word.categories"
									:show-add-button="hoverOnWordId === word.id"
									@click="openEditingWordFormOnCategoriesTab(word.id)"
								/>
							</td>

							<td style="margin-inline-start: auto">
								<DropdownMenuComp 
									v-slot="{ isMenuOpen }"
									:items="[
										{ 
											label: $t('edit'),
											icon: 'edit',
											handler: () => openEditingWordForm(word.id)
										},
										'separator',
										{ 
											label: $t('delete'), 
											icon: 'delete', 
											color: 'negative', 
											handler: () => removeWord(word)
										},
									]"		
								>
									<ButtonComp
										icon="more_vert"
										appearance="inline"
										color="neutral"
										:pressed="isMenuOpen"
									/>
								</DropdownMenuComp>
							</td>
						</TableRowComp>
					</template>

					<template
						v-else-if="loadState === 'loading'"
						#body
					>
						<TableRowComp
							v-for="row in limit"
							:key="row"
							:grid-template-columns="gridTemplateColumns"
						>
							<td />

							<td>
								<SkeletonItemComp
									width="40px"
									height="40px"
									border-radius="8px"
								/>
							</td>

							<td
								v-for="col in translationColumns.length"
								:key="`${row}-${col}`"
							>
								<SkeletonItemComp
									height="20px"
									random-width
									border-radius="4px"
								/>
							</td>

							<td>
								<SkeletonItemComp
									height="20px"
									random-width
									border-radius="4px"
								/>
							</td>
						</TableRowComp>
					</template>

					<template
						v-else
						#body
					>
						<ZeroStateComp
							icon="search"
							:title="notFoundTitle"
							:description="$t('not-found-description')"
						/>
					</template>

					<template
						v-if="showPagination"
						#pagination
					>
						<PaginationBarComp
							:count="count"
							:offset="offset"
							:limit="limit"
							:limit-options="limitOptions"
							@update:limit="limit = $event"
							@update:offset="offset = $event"
						/>
					</template>
				</TableComp>
			</div>
		</div>
	</div>

	<WordFormModalComp
		v-if="showWordForm"
		:word-id="editingWordId"
		@close="showWordForm = false"
	/>

	<CategoryWordsInsertModalComp
		v-if="showCategoryWordsInsertModal && filter.category_id"
		:category-id="filter.category_id"
		@close="showCategoryWordsInsertModal = false"
		@refetch="refetch"
	/>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.words-view {
	display: grid;
	grid-template-columns: 280px 1fr;
	width: 100%;
	height: 100%;
	
	&__content {
		padding-inline: 16px;
	}

	&__add-to-category-button {
		margin-inline-end: 16px;
	}
}

.translation-confirmation-modal {
	display: flex;
	flex-direction: column;

	&__title {
		@include text-subtitle-1;
		margin-block-end: 12px;
	}

	&__buttons {
		display: flex;
		column-gap: 16px;
	}
}
</style>
