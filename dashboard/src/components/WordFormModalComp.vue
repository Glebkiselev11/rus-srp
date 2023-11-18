<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "./ModalComp.vue";
import WordFormComp from "./WordFormComp.vue";
import { mapState } from "pinia";
import { useWordsStore } from "@/stores/words";
import type { Word } from "@/types/words";

export default defineComponent({
	name: "WordFormModalComp",
	components: {
		ModalComp,
		WordFormComp,
	},
	props: {
		// If provided word id, then form will be in edit mode
		wordId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["close"],
	computed: {
		...mapState(useWordsStore, ["getWordById"]),
		word(): Word | undefined {
			return this.wordId ? this.getWordById(this.wordId) : undefined;
		},
		title(): string {
			return this.wordId ? this.$t("editing-word") : this.$t("creation-word");
		},
		subtitle(): string {
			if (this.word) {
				// eslint-disable-next-line max-len
				return `${this.word.rus} - ${this.word.eng} - ${this.word.srp_latin} - ${this.word.srp_cyrillic}`; 
			} else {
				return this.$t("creation-word");
			}
		},
	},
	methods: {
		close() {
			this.$emit("close");
		},
	},
});

</script>

<template>
	<ModalComp
		:title="title"
		:subtitle="subtitle"
		@close="close"
	>
		<template #content>
			<WordFormComp :word="word" />
		</template>
	</ModalComp>
</template>
