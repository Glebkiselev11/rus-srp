<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useWordsStore } from "@/stores/words";
import type { Order, RequestParams } from "@/types/api";

import AppCategories from "@/components/AppCategories/index.vue";
import AppTopBar from "@/components/AppTopBar.vue";
import AppInput from "@/components/AppInput.vue";
import AppSelect from "@/components/AppSelect.vue";
import AppTable from "@/components/AppTable/index.vue";
import AppTableRow from "@/components/AppTable/AppTableRow.vue";
import AppImagePreview from "@/components/AppImagePreview.vue";
import AppButton from "@/components/AppButton.vue";
import AppDropdownMenu from "@/components/AppDropdownMenu.vue";
import AppPaginationBar from "@/components/AppPaginationBar.vue";
import AppZeroState from "@/components/AppZeroState.vue";
import AppWordsPageCategoryTitle from "@/components/AppWordsPageCategoryTitle.vue";
import { highlighTextByQuery } from "@/common/utils";

import type { Word } from "@/types/words";
import type { LanguageCode } from "@/types/translations";

const LIMIT_DEFAULT = 25;

export default defineComponent({
	name: "WordsView",
	components: {
		AppTopBar,
		AppInput,
		AppSelect,
		AppTable,
		AppTableRow,
		AppImagePreview,
		AppButton,
		AppDropdownMenu,
		AppPaginationBar,
		AppZeroState,
		AppCategories,
		AppWordsPageCategoryTitle,
	},
	data() {
		return {
			columns: [
				{ sortable: true, sort_key: "image", 
					icon: { 
						name: "image", 
						color: "tertiary", 
					} as const, width: "40px" },
				{ label: "Русский", sortable: true, sort_key: "rus", width: "200px" }, 
				{ label: "English", sortable: true, sort_key: "eng", width: "200px" }, 
				{ label: "Srpski", sortable: true, sort_key: "srp_latin", width: "200px" }, 
				{ label: "Српски", sortable: true, sort_key: "srp_cyrillic" },
				{ sortable: false, width: "50px" },
			],
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
		};
	},
	computed: {
		...mapState(useWordsStore, ["words", "count"]),
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
					this.fetchWords(params);
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
	},
	mounted() {
		this.fetchWords(this.filter);
	},
	methods: {
		...mapActions(useWordsStore, ["fetchWords", "deleteWord", "updateWord"]),
		highlighTextByQuery,
		updateOrder(order: Order) {
			this.filter = { ...this.filter, order };
		},
		openNewWordPage() {
			console.log("openNewWordPage");
		},
		async removeWord(word: Word) {
			const key = this.$i18n.locale as LanguageCode;

			if (confirm(this.$t("are-you-sure-delete", { word: word[key] }))) {
				this.deleteWord(word.id);
			}
		},
		editWord(id: number) {
			console.log("editWord", id);
		},
		extractWordPreview(word: Word): string {
			return `${word.rus} — ${word.eng} — ${word.srp_latin} — ${word.srp_cyrillic}`;
		},
		updateWordImage(word: Word, src: string) {
			this.updateWord({ ...word, image: src });
		},
	},
});
</script>

<template>
	<div class="words-view">
		<AppCategories 
			:selected-category-id="filter.category_id"
			@update:selected-category-id="category_id = $event"
		/>

		<div>
			<AppTopBar>
				<template #left>
					<AppWordsPageCategoryTitle :category-id="filter.category_id" />
				</template>
				<template #right>
					<AppButton
						icon="add"
						:label="$t('add-word')"
						@click="openNewWordPage"
					/>
				</template>
			</AppTopBar>

			<div class="words-view__content">
				<div class="words-view__filter-panel">
					<AppInput
						v-model="search"
						type="text"
						:placeholder="$t('find-word')"
						left-icon="search"
						debounce
					/>	

					<AppSelect
						v-model="order"
						:options="orderOptions"
						type="inline"
						icon="sort"
						size="compact"
						:placeholder="$t('to-sort')"
						compact
					/>
				</div>
				<AppTable
					:count="count"
					:columns="columns"
					:order="filter.order"
					@update:order="updateOrder"
				>
					<template
						v-if="words.length"
						#body
					>
						<AppTableRow
							v-for="word in words"
							:id="word.id"
							:key="word.id"
						>
							<td>
								<AppImagePreview
									:src="word.image"
									:image-search-modal-subtitle="extractWordPreview(word)"
									:default-image-search-query="word.eng"
									@update:src="src => updateWordImage(word, src)"
								/>
							</td>
							<td v-html="highlighTextByQuery(word.rus, search)" />
							<td v-html="highlighTextByQuery(word.eng, search)" />
							<td v-html="highlighTextByQuery(word.srp_latin, search)" />
							<td v-html="highlighTextByQuery(word.srp_cyrillic, search)" />
							<td style="margin-inline-start: auto">
								<AppDropdownMenu 
									v-slot="{ isMenuOpen }"
									:items="[
										{ 
											label: $t('edit'),
											icon: 'edit',
											handler: () => editWord(word.id)
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
									<AppButton
										icon="more_vert"
										appearance="inline"
										color="neutral"
										:pressed="isMenuOpen"
									/>
								</AppDropdownMenu>
							</td>
						</AppTableRow>
					</template>

					<template
						v-else
						#body
					>
						<AppZeroState
							icon="search"
							:title="notFoundTitle"
							:description="$t('not-found-description')"
						/>
					</template>

					<template
						v-if="count > limit"
						#pagination
					>
						<AppPaginationBar
							:count="count"
							:offset="offset"
							:limit="limit"
							:limit-options="limitOptions"
							@update:limit="limit = $event"
							@update:offset="offset = $event"
						/>
					</template>
				</AppTable>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">

.words-view {
	display: grid;
	grid-template-columns: 280px 1fr;
	width: 100%;
	height: 100%;

	&__filter-panel {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-block-end: 16px;
	}
	
	&__content {
		padding-inline: 16px;
	}
}
</style>
