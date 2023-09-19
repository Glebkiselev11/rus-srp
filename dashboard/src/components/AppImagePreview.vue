<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppIcon from "@/components/AppIcon/index.vue";
import AppModal from "@/components/AppModal.vue";
import AppImagesSearch from "./AppImagesSearch.vue";
import { addCropImagaeParamsToUrl } from "@/utils";

export default defineComponent({
	name: "AppImagePreview",
	components: {
		AppIcon,
		AppModal,
		AppImagesSearch,
	}, 
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
	data() {
		return {
			isModalVisible: false,
		};
	},
	computed: {
		srcWithParams(): string {
			return this.src ? this.addCropImagaeParamsToUrl(this.src, 200) : "";
		},
		imagesSearchModalTitle(): string {
			return this.src ? this.$t("edit-image") : this.$t("add-image");
		},
	},
	methods: {
		addCropImagaeParamsToUrl,
		handleClick(): void {
			this.isModalVisible = true;
		},
		handleSelectImage(src: string): void {
			this.$emit("update:src", src);
			this.isModalVisible = false;
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

	<AppModal 
		:visible="isModalVisible"
		:title="imagesSearchModalTitle"
		:subtitle="imageSearchModalSubtitle"
		@update:visible="isModalVisible = $event"
	>
		<AppImagesSearch
			:default-search-query="defaultImageSearchQuery"
			:saved-link="src"
			@select="handleSelectImage"
		/>
	</AppModal>
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