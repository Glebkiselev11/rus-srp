<script lang="ts">
import { defineComponent } from "vue";
import InputComp from "../InputComp.vue";
import ButtonComp from "../ButtonComp.vue";
import WordFormModalComp from "../WordForm/WordFormModalComp.vue";
import { mapActions, mapState } from "pinia";
import { useModalWordsStore } from "@/stores/words/modalWords";
import  TableComp from "@/components/Table/TableComp.vue";
import TableRowComp from "../Table/TableRowComp.vue";
import ImagePreviewComp from "../ImagePreviewComp.vue";
import { highlighTextByQuery } from "@/common/utils";
import { getLanguageCodesOrder } from "@/common/translations";
import type { Id } from "@/types/api";
import CounterComp from "../CounterComp.vue";
import SwitchComp from "../SwitchComp.vue";
import ZeroStateComp from "../ZeroStateComp.vue";
import CheckboxComp from "../CheckboxComp.vue";
import TooltipComp from "../TooltipComp.vue";

export default defineComponent({
	name: "CategoryWordsInsertComp",
	components: {
		InputComp,
		ButtonComp,
		WordFormModalComp,
		TableComp,
		TableRowComp,
		ImagePreviewComp,
		CounterComp,
		SwitchComp,
		ZeroStateComp,
		CheckboxComp,
		TooltipComp,
	},
	props: {
		categoryId: {
			type: Number,
			required: true,
		},
	},
	emits: ["close", "words-inserted"],
	data() {
		return {
			showWordForm: false,
			search: "",
			offset: 0,
			limit: 50,
			translationOrder: getLanguageCodesOrder(),
			gridTemplateColumns: "48px 64px 1fr 1fr 1fr 1fr",
			showOnlySelected: false,
		};
	},
	computed: {
		...mapState(useModalWordsStore, [
			"words", 
			"loadState", 
			"count", 
			"selectedWordIds", 
			"isAnyWordSelected",
		]),
		requestParams() {
			return {
				search: this.search,
				offset: this.offset,
				limit: this.limit,
			};
		},
		alreadyAddedWordIds() {
			return this.words
				.filter(({ categories }) => categories.some(({ id }) => id === this.categoryId))
				.map(({ id }) => id);
		},
		filteredWords() {
			if (this.showOnlySelected) {
				return this.words.filter(({ id }) => this.selectedWordIds.includes(id));
			} else {
				return this.words;
			}
		},
		nothingWereFound() {
			return this.filteredWords.length === 0 && this.loadState === "loaded";
		},
	},
	watch: {
		search() {
			this.offset = 0;
			this.clearModalWords();
			this.fetchModalWords(this.requestParams);
		},
		selectedWordIds(ids: Id[]) {
			if (ids.length === 0) {
				this.showOnlySelected = false;
			}
		},	
	},
	async created() {
		await this.fetchModalWords(this.requestParams);
	},
	methods: {
		...mapActions(useModalWordsStore, [
			"fetchModalWords", 
			"clearModalWords", 
			"updateSelectedWordIds",
			"addSelectedWordsToCategory",
		]),
		highlighTextByQuery,
		loadMore() {
			if (this.loadState === "loading" || this.offset >= this.count) return;
			this.offset += this.limit;

			this.fetchModalWords(this.requestParams);
		},
		isWordChecked(wordId: Id): boolean {
			return this.selectedWordIds.includes(wordId) || 
				this.alreadyAddedWordIds.includes(wordId);
		},
		isWordDisabled(wordId: Id): boolean {
			return this.alreadyAddedWordIds.includes(wordId);
		},
		getTooltipText(wordId: Id): string {
			if (this.isWordDisabled(wordId)) {
				return this.$t("included-in-the-category");
			} 

			if (this.isWordChecked(wordId)) {
				return this.$t("dont-add-to-category");
			}

			return this.$t("add-to-category");
		},
		async clickAddButton() {
			await this.addSelectedWordsToCategory(this.categoryId);
			this.$emit("words-inserted");
		},
		close() {
			this.$emit("close");
		},
	},
});

</script>

<template>
	<div class="category-words-insert">
		<div class="category-words-insert__panel">
			<InputComp
				v-model="search"
				appearance="outline"
				clear-button
				debounce
				class="category-words-insert__search-input"
				:placeholder="$t('find-word')"
				left-icon="search"
			/>

			<ButtonComp
				icon="add"
				appearance="inline" 
				class="category-words-insert__create-word-button"
				:label="$t('create-word')"
				@click="showWordForm = true"
			/>
		</div>

		<TableComp 
			:grid-template-columns="gridTemplateColumns"
			:infinite-scroll-config="{ distance: 100 }"
			@scroll-to-bottom="loadMore"
		>
			<template
				v-if="nothingWereFound"
				#body
			>
				<ZeroStateComp
					icon="search"
					:title="$t('not-found', { search })"
					:description="$t('not-found-description')"
				/>
			</template>

			<template
				v-else
				#body
			>
				<section>
					<TableRowComp
						v-for="word in filteredWords"
						:key="word.id"
						:grid-template-columns="gridTemplateColumns"
					>
						<td>
							<TooltipComp
								:text="getTooltipText(word.id)"	
								position="bottom-right"
							>
								<CheckboxComp
									:model-value="isWordChecked(word.id)"
									:disabled="isWordDisabled(word.id)"
									@update:model-value="(x) => updateSelectedWordIds(word.id, x)"
								/>
							</TooltipComp>
						</td>

						<td>
							<ImagePreviewComp
								:src="word.image"
								static
							/>
						</td>

						<td
							v-for="(langCode, i) in translationOrder"
							:key="`${word.id}-${i}`"
							v-html="highlighTextByQuery(word[langCode], search)"
						/>
					</TableRowComp>
				</section>

				<template v-if="loadState === 'loading'">
					<TableRowComp
						v-for="row in limit"
						:key="row"
						:grid-template-columns="gridTemplateColumns"
					>
						<td
							class="category-words-insert__skeleton-cell"
							style="height: 40px;"
						/>

						<td 
							v-for="col in translationOrder.length"
							:key="`${row}-${col}`"
							class="category-words-insert__skeleton-cell"
							style="height: 20px;"
						/>
					</TableRowComp>
				</template>
			</template>
		</TableComp>

		<div class="category-words-insert__footer">
			<div v-show="isAnyWordSelected">
				<span v-text="$t('show-only-selected')" />
				<SwitchComp
					v-model="showOnlySelected"
				/>
			</div>

			<!-- This extra div needed for make sure that save buttos always right -->
			<div />

			<div>
				<ButtonComp
					:label="$t('cancel')"
					appearance="secondary"
					@click="close"
				/>

				<ButtonComp
					:label="$t('add')"
					:disabled="!isAnyWordSelected"
					@click="clickAddButton"
				>
					<template
						v-if="isAnyWordSelected"
						#right
					>
						<CounterComp :count="selectedWordIds.length" />	
					</template>
				</ButtonComp>
			</div>
		</div>
	</div>

	<WordFormModalComp
		v-if="showWordForm"
		@close="showWordForm = false"
	/>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.category-words-insert {
	padding: 20px;
	width: 704px;

	&__panel {
		display: flex;
		align-items: center;
		margin-block-end: 16px;
	}

	&__search-input {
		flex-shrink: 1;
	}

	&__create-word-button {
		flex-shrink: 0;
		margin-inline-start: 16px;
	}

	&__skeleton-cell {
		background: $color-background-content-tertiary;
		margin-inline-start: 16px;
		margin-inline-end: 8px;
		display: flex;
		align-items: center;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		margin-block-start: 20px;
		height: 40px;

		& > div {
			display: flex;
			column-gap: 8px;
			align-items: center;
		}
	}
}

</style>
