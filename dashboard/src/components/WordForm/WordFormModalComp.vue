<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "../ModalComp.vue";
import WordFormComp from "./WordFormComp.vue";
import { mapState } from "pinia";
import { useWordsStore } from "@/stores/words";
import type { Word } from "@/types/words";
import FormCloseConfirmationModalComp from "../FormCloseConfirmationModalComp.vue";
import { useDraftWordStore } from "@/stores/draftWord";
import { translationPreview } from "@/common/utils";

export default defineComponent({
	name: "WordFormModalComp",
	components: {
		ModalComp,
		WordFormComp,
		FormCloseConfirmationModalComp,
	},
	props: {
		// If provided word id, then form will be in edit mode
		wordId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["close"],
	data() {
		return {
			showCloseConfirmationModal: false,
		};
	},
	computed: {
		...mapState(useWordsStore, ["getWordById"]),
		...mapState(useDraftWordStore, ["anyTranslationFilled", "draftWord", "isChanged"]),
		word(): Word | undefined {
			return this.wordId ? this.getWordById(this.wordId) : undefined;
		},
		title(): string {
			return this.wordId ? this.$t("editing-word") : this.$t("creation-word");
		},
		subtitle(): string {
			if (this.word) {
				return translationPreview(this.word);
			} else if (this.anyTranslationFilled) {
				return translationPreview(this.draftWord);
			} else {
				return this.$t("new-word");
			}
		},
		closeConfirmationTitle() {
			return Boolean(this.word) 
				? this.$t("modal-exit-confirmation.edit-word-title")
				: this.$t("modal-exit-confirmation.creation-word-title"); 
		},
		closeConfirmationCancelButtonLabel() {
			return Boolean(this.word)
				? this.$t("modal-exit-confirmation.continue-editing")
				: this.$t("modal-exit-confirmation.continue-creation");
		},
	},
	methods: {
		close() {
			this.$emit("close");
		},
		tryClose() {
			if (this.isChanged) {
				this.showCloseConfirmationModal = true;
			} else {
				this.close();
			}
		},
	},
});

</script>

<template>
	<ModalComp
		:title="title"
		:subtitle="subtitle"
		@close="tryClose"
	>
		<template #content>
			<WordFormComp
				:word="word"
				@close="tryClose"
				@saved="close"
			/>
		</template>
	</ModalComp>

	<FormCloseConfirmationModalComp
		v-if="showCloseConfirmationModal"
		:title="closeConfirmationTitle"
		:cancel-button-label="closeConfirmationCancelButtonLabel"
		@close="showCloseConfirmationModal = false"
		@confirm="close"
	/>
</template>
