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

export default defineComponent({
	name: "CategoryWordsInsertComp",
	components: {
		InputComp,
		ButtonComp,
		WordFormModalComp,
		TableComp,
		TableRowComp,
		ImagePreviewComp,
	},
	props: {
		categoryId: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			showWordForm: false,
			search: "",
			offset: 0,
			limit: 50,
			translationOrder: getLanguageCodesOrder(),
			gridTemplateColumns: "64px 1fr 1fr 1fr 1fr",
		};
	},
	computed: {
		...mapState(useModalWordsStore, ["words", "loadState", "count"]),
		requestParams() {
			return {
				search: this.search,
				offset: this.offset,
				limit: this.limit,
			};
		},
	},
	watch: {
		search() {
			this.offset = 0;
			this.clearModalWords();
			this.fetchModalWords(this.requestParams);
		},
	},
	async created() {
		await this.fetchModalWords(this.requestParams);
	},
	methods: {
		...mapActions(useModalWordsStore, ["fetchModalWords", "clearModalWords"]),
		highlighTextByQuery,
		loadMore() {
			if (this.loadState === "loading" || this.offset >= this.count) return;
			this.offset += this.limit;

			this.fetchModalWords(this.requestParams);
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
			checkable
			:grid-template-columns="gridTemplateColumns"
			:infinite-scroll-config="{ distance: 100 }"
			@scroll-to-bottom="loadMore"
		>
			<template #body>
				<section>
					<TableRowComp
						v-for="word in words"
						:key="word.id"
						:grid-template-columns="gridTemplateColumns"
					>
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
}

</style>
