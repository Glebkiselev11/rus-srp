<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useWordsStore } from "@/stores/words";
import type { Order, RequestParams } from "@/types/api";

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
import { highlighTextByQuery } from "@/utils";

import type { Word } from "@/types/words";
import type { LanguageCode } from "@/i18n";

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
				{ value: "-created_at", label: "created" },
				{ value: "-updated_at", label: "updated" },
			],
		};
	},
	computed: {
		...mapState(useWordsStore, ["words", "count"]),
		filter: {
			get(): RequestParams {
				return {
					search: this.$route.query.search as string || "",
					offset: Number(this.$route.query.offset) || 0,
					limit: Number(this.$route.query.limit) || LIMIT_DEFAULT,
					order: (this.$route.query.order as string || "-created_at") as Order,
				};
			},
			set(params: RequestParams) {
				this.$router.push({
					query: {
						...params,
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
				this.filter = { ...this.filter, search };
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
				return this.filter.order;
			},
			set(order: Order) {
				this.filter = { ...this.filter, order };
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
			const localeToKeyMap: Record<LanguageCode, keyof Word> = {
				"en": "eng",
				"ru": "rus",
				"srp-latin": "srp_latin",
				"srp-cyrillic": "srp_cyrillic",
			};

			const key = localeToKeyMap[this.$i18n.locale as LanguageCode];

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
		<AppTopBar>
			<template #left>
				<h3>
					{{ $t("all-words") }}
				</h3>
			</template>
			<template #right>
				<AppButton
					icon="add"
					:label="$t('add-word')"
					@click="openNewWordPage"
				/>
			</template>
		</AppTopBar>

		<div class="words-view--content">
			<div class="words-view--filter-panel">
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
									type="inline"
									color="neutral"
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
</template>

<style scoped lang="scss">

.words-view {
	width: 100%;
	height: 100%;

	&--filter-panel {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-block-end: 16px;
	}
	
	&--content {
		padding-inline: 32px;
	}
}
</style>
