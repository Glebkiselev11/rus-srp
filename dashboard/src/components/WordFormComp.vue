<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ImageSectionComp from "./ImageSectionComp.vue";
import type { DraftWord, Word } from "@/types/words";

export default defineComponent({
	name: "WordFormComp",
	components: { ImageSectionComp },
	props: {
		word: {
			type: Object as PropType<Word>,
			default: undefined,
		},
	},
	data() {
		return {
			draftWord: {
				rus: "",
				eng: "",
				srp_latin: "",
				srp_cyrillic: "",
				image: null,
			} as DraftWord,
		};
	},
	computed: {
		subtitle(): string {
			if (this.word) {
				// eslint-disable-next-line max-len
				return `${this.draftWord.rus} - ${this.draftWord.eng} - ${this.draftWord.srp_latin} - ${this.draftWord.srp_cyrillic}`; 
			} else {
				return this.$t("new-word");
			}
		},
	},
	created() {
		if (this.word) {
			this.draftWord = { ...this.word };
		}
	},
});

</script>

<template>
	<div class="word-form">
		<ImageSectionComp
			:src="draftWord.image"
			:default-image-search-query="draftWord.eng"
			@update:src="draftWord.image = $event"
		>
			<div>
				<h4>{{ $t("image") }}</h4>
				<span class="text-body-2">{{ subtitle }}</span>
			</div>
		</ImageSectionComp>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.word-form {
	padding-inline: 16px;
	padding-block-end: 20px;
	width: 598px;
}

</style>
