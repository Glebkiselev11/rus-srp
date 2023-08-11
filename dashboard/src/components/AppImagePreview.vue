<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppIcon from "@/components/AppIcon/index.vue";

export default defineComponent({
	name: "AppImagePreview",
	components: {
		AppIcon,
	}, 
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
	<div class="app-image-preview">
		<img
			v-if="src"
			:src="srcWithParams"
		>
		<app-icon
			v-else
			name="filter_hdr"
			color="tertiary"
		/>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-image-preview {
	width: 40px;
	height: 40px;
	border-radius: 8px;
	overflow: hidden;
	background-color: $color-image-placeholder;
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		width: inherit;
		height: inherit;
	}
}

</style>