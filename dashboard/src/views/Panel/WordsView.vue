<script lang="ts">
import { defineComponent } from "vue";
import AppTopBar from "@/components/AppTopBar.vue";
import AppInput from "@/components/AppInput.vue";
import type { Order, RequestParams } from "@/types/api";
import { mapActions, mapState } from "pinia";
import { useWordsStore } from "@/stores/words";

export default defineComponent({
	name: "WordsView",
	components: {
		AppTopBar,
		AppInput,
	},
	computed: {
		...mapState(useWordsStore, ["words"]),
		filter: {
			get(): RequestParams {
				return {
					search: this.$route.query.search as string || "",
					offset: Number(this.$route.query.offset) || 0,
					limit: Number(this.$route.query.limit) || 20,
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
	},
	mounted() {
		this.fetchWords(this.filter);
	},
	methods: {
		...mapActions(useWordsStore, ["fetchWords"]),
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
				right
			</template>
		</AppTopBar>

		<div class="words-view--content">
			<div
				v-for="word in words"
				:key="word.id"
				class="word-item"
			>
				{{ `${word.eng} - ${word.rus} - ${word.srp_latin} - ${word.srp_cyrillic}` }}
			</div>
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

.word-item {
	padding: 12px;
	border: 1px solid grey;
	margin-block-end: 10px;
}

</style>