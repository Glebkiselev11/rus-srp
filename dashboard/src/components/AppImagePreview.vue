<script lang="ts">
import { defineComponent, type PropType } from "vue";
import IconComp from "@/components/IconComp/index.vue";
import AppModal from "@/components/AppModal.vue";
import AppImagesSearch from "./AppImagesSearch.vue";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import type { IconSize } from "@/types/icons";

type PreviewSize = "24px" | "32px" | "40px" | "48px" | "56px" | "64px" | "96px";

export default defineComponent({
	name: "AppImagePreview",
	components: {
		IconComp,
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
		// Disable modal window and show image preview only
		static: {
			type: Boolean,
			default: false,
		},
		defaultImageSearchQuery: {
			type: String,
			default: null,
		},
		size: {
			type: String as PropType<PreviewSize>,
			default: "40px",
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
		iconSize(): IconSize {
			switch (this.size) {
			case "24px":
				return "small";
			case "32px":
			case "40px":
				return "compact";
			default:
				return "regular";
			}
		},
	},
	methods: {
		addCropImagaeParamsToUrl,
		handleClick(e: Event): void {
			if (this.static) return;

			e.stopPropagation();
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
		:style="{ width: size, height: size }"
		@click="handleClick"
	>
		<img
			v-if="src"
			:src="srcWithParams"
		>
		<IconComp
			v-else
			name="filter_hdr"
			:size="iconSize"
			color="tertiary"
		/>

		<div
			v-if="!static"
			class="app-image-preview--overlay"
		>
			<IconComp
				v-if="src"
				name="edit"
				color="contrast"
				:size="iconSize"
			/>

			<IconComp
				v-else
				name="add_photo_alternate"
				color="contrast"
				:size="iconSize"
			/>
		</div>
	</button>

	<AppModal 
		v-if="!static && isModalVisible"
		:title="imagesSearchModalTitle"
		:subtitle="imageSearchModalSubtitle"
		@close="isModalVisible = false"
	>
		<template
			v-if="src"
			#header-left
		>
			<AppImagePreview
				:src="srcWithParams"
				static
			/>
		</template>

		<template #content>
			<AppImagesSearch
				:default-search-query="defaultImageSearchQuery"
				:saved-link="src"
				@select="handleSelectImage"
			/>
		</template>
	</AppModal>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-image-preview {
	border: none;
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
