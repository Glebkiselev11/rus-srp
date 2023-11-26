<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "./ModalComp.vue";
import WordFormComp from "./WordFormComp.vue";
import { mapState } from "pinia";
import { useWordsStore } from "@/stores/words";
import type { Word } from "@/types/words";
import FormCloseConfirmationModalComp from "./FormCloseConfirmationModalComp.vue";

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
			subtitle: "", // Updating from child component
			// Mark as changed to prevent closing modal without confirmation
			isChanged: false,
			showCloseConfirmationModal: false,
		};
	},
	computed: {
		...mapState(useWordsStore, ["getWordById"]),
		word(): Word | undefined {
			return this.wordId ? this.getWordById(this.wordId) : undefined;
		},
		title(): string {
			return this.wordId ? this.$t("editing-word") : this.$t("creation-word");
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
		setChanged(status: boolean) {
			this.isChanged = status;
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
				@update-modal-subtitle="subtitle = $event"
				@close="tryClose"
				@saved="close"
				@set-changed-status="setChanged"
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
