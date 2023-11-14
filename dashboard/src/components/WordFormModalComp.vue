<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "./ModalComp.vue";
import WordFormComp from "./WordFormComp.vue";

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
		title(): string {
			return this.wordId ? this.$t("editing-word") : this.$t("creation-word");
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
		@close="close"
	>
		<template #content>
			<WordFormComp />
		</template>
	</ModalComp>
</template>
