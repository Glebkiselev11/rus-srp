<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ImagePreviewComp from "./ImagePreviewComp.vue";

export default defineComponent({
	name: "ImageSectionComp",
	components: { ImagePreviewComp },
	props: {
		src: {
			type: [String, null] as PropType<string | null>,
			required: true,
		},
		imageSearchModalSubtitle: {
			type: String,
			default: null,
		},
		defaultImageSearchQuery: {
			type: String,
			default: null,
		},
	},
	emits: ["update:src"],
	methods: {
		updateSrc(src: string) {
			this.$emit("update:src", src);
		},
	},
});

</script>

<template>
	<div class="image-section">
		<ImagePreviewComp
			size="96px"
			:src="src"
			:image-search-modal-subtitle="imageSearchModalSubtitle"
			:default-image-search-query="defaultImageSearchQuery"
			@update:src="updateSrc"
		/>

		<slot />
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";
.image-section {
  display: flex;
  column-gap: 24px;
  width: 100%;
  height: 144px;
  padding: 24px;
  background: $color-background;
  border-radius: 16px;
}

</style>
