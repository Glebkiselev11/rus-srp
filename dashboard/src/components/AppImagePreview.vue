<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "AppImagePreview",
	props: {
		src: {
			type: Object as PropType<string | null>,
			default: null,
		},
	},
	computed: {
		srcWithParams(): string {
			if (!this.src) {
				return "";
			}
			return this.addCropImagaeParamsToUrl(this.src, 200);
		},
	},
	methods: {
		addCropImagaeParamsToUrl(src: string, size: number): string {
			const url = new URL(src);
			url.searchParams.append("fit", "crop");
			url.searchParams.append("h", size.toString());
			url.searchParams.append("w", size.toString());
			return url.toString();
		},
	},
});

</script>

<template>
	<img
		v-if="src"
		class="app-image-preview"
		:src="srcWithParams"
	>
</template>

<style lang="scss" scoped>

.app-image-preview {
	width: 40px;
	height: 40px;
	border-radius: 8px;
}

</style>