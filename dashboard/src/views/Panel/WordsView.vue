<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapState } from "pinia";
import { useWordsStore } from "@/stores/words";
import type { Order, RequestParams } from "@/types/api";

import AppTopBar from "@/components/AppTopBar.vue";
import AppInput from "@/components/AppInput.vue";
import AppTable from "@/components/AppTable/index.vue";
import AppTableRow from "@/components/AppTable/AppTableRow.vue";
import AppImagePreview from "@/components/AppImagePreview.vue";
import AppButton from "@/components/AppButton.vue";
import AppDropdownMenu from "@/components/AppDropdownMenu.vue";
import AppPagination from "@/components/AppPagination.vue";

import type { Word } from "@/types/words";
import type { LanguageCode } from "@/i18n";


export default defineComponent({
	name: "WordsView",
	components: {
		AppTopBar,
		AppInput,
		AppTable,
		AppTableRow,
		AppImagePreview,
		AppButton,
		AppDropdownMenu,
		AppPagination,
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
			
		};
	},
	computed: {
		...mapState(useWordsStore, ["words", "count"]),
		filter: {
			get(): RequestParams {
				return {
					search: this.$route.query.search as string || "",
					offset: Number(this.$route.query.offset) || 0,
					limit: Number(this.$route.query.limit) || 10,
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
	},
	mounted() {
		this.fetchWords(this.filter);
	},
	methods: {
		...mapActions(useWordsStore, ["fetchWords", "deleteWord"]),
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
	},
});
</script>

<template>
	<div class="words-view">
		<AppTopBar>
			<template #left>
				<AppInput
					v-model="search"
					type="text"
					:placeholder="$t('find-word')"
					left-icon="search"
					debounce
				/>	
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
			<AppTable
				:count="count"
				:columns="columns"
				:order="filter.order"
				@update:order="updateOrder"
			>
				<template #body>
					<AppTableRow
						v-for="word in words"
						:id="word.id"
						:key="word.id"
					>
						<td>
							<AppImagePreview
								:src="word.image"
							/>
						</td>
						<td>
							{{ word.rus }}
						</td>
						<td>
							{{ word.eng }}
						</td>
						<td>
							{{ word.srp_latin }}
						</td>
						<td>
							{{ word.srp_cyrillic }}
						</td>
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

				<template #pagination>
					<AppPagination
						:count="count"
						:offset="offset"
						:limit="limit"
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
	
	&--content {
		padding: 20px;
	}
}

</style>