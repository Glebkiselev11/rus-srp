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
			type: [String, null] as PropType<string | null>,
			required: true,
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
		handleClick(): void {
			if (this.src) {
				console.log("edit image");
			} else {
				console.log("add image");
			}
		},
	},
});

</script>

<template>
	<button
		class="app-image-preview"
		@click="handleClick"
	>
		<img
			v-if="src"
			:src="srcWithParams"
		>
		<app-icon
			v-else
			name="filter_hdr"
			color="tertiary"
		/>

		<div class="app-image-preview--overlay">
			<app-icon
				v-if="src"
				name="edit"
				color="contrast"
				size="compact"
			/>

			<app-icon
				v-else
				name="add_photo_alternate"
				color="contrast"
				size="compact"
			/>
		</div>
	</button>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-image-preview {
	border: none;
	width: 40px;
	height: 40px;
	border-radius: 8px;
	overflow: hidden;
	background-color: $color-image-placeholder;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;

	img {
		width: inherit;
		height: inherit;
	}

	&--overlay {
		visibility: hidden;
		position: absolute;
		inset-block-start: 0;
		inset-inline-start: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: $color-avatar-overlay-alpha;
	}

	&:hover {
		.app-image-preview--overlay {
			visibility: visible;
			cursor: pointer;
		}
	}
}

</style>