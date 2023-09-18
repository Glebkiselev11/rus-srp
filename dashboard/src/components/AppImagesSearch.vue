<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppInput from "./AppInput.vue";
import AppIcon from "./AppIcon/index.vue";
import { addCropImagaeParamsToUrl } from "@/utils";
import { useImagesStore } from "@/stores/images";
import { mapActions, mapState } from "pinia";
import type { RequestParams } from "@/types/api";

export default defineComponent({
	name: "AppImagesSearch",
	components: {
		AppInput,
		AppIcon,
	},
	props: {
		savedLink: {
			type: [String, null] as PropType<string | null>,
			default: null,
		},
		defaultSearchQuery: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			searchQuery: this.defaultSearchQuery,
			offset: 0,
			limit: 50,
		};
	},
	computed: {
		...mapState(useImagesStore, ["images", "count"]),
		requestParams(): RequestParams {
			return {
				search: this.searchQuery,
				offset: this.offset,
				limit: this.limit,
			};
		},
		filteredImages() {
			return this.images.filter(({ src }) => src !== this.savedLink);
		},
	},
	created() {
		this.fetchImages(this.requestParams);
	},
	beforeUnmount() {
		this.clearImages();
	},
	methods: {
		...mapActions(useImagesStore, ["fetchImages", "clearImages"]),
		addCropImagaeParamsToUrl,
		selectImage(src: string) {
			console.log(src);
		},
	},
});
</script>

<template>
	<div class="app-image-search">
		<AppInput
			v-model="searchQuery"
			width="100%"
			type="text"
			left-icon="search"
			class="app-image-search--input"
			debounce
		/>

		<section class="app-image-search-list">
			<div 
				v-if="savedLink"
				class="selected-image"
			>
				<img
					class="app-image-search-list--image"
					:src="addCropImagaeParamsToUrl(savedLink, 300)"
				>

				<div class="selected-image--badge">
					<AppIcon
						name="check_circle"
						color="accent-primary"
					/>
					{{ $t('selected') }}
				</div>
			</div>

			<img
				v-for="image in filteredImages"
				:key="image.id"
				class="app-image-search-list--image"
				:src="addCropImagaeParamsToUrl(image.src, 300)"
				@click="selectImage(image.src)"
			>
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-image-search {
	inline-size: 946px;
	padding-inline-start: 12px;

	&--input {
		margin-inline-end: 12px;
	}
}

.app-image-search-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-block-start: 20px;
	block-size: 70vh;
	overflow: auto;


	&--image {
		width: 218px;
		height: 218px;
		object-fit: cover;
		border-radius: 12px;
		cursor: pointer;
	}
}

.selected-image {
	position: relative;

	&--badge {
		@extend .text-caption-2;

		position: absolute;
		height: 28px;
		inset-block-start: 8px;
		inset-inline-end: 8px;
		border-radius: 8px;
		padding-inline-start: 8px;
		padding-inline-end: 12px;
		display: flex;
		align-items: center;
		gap: 4px;
		background: $color-background-content-primary;
	}

	img {
		border: 2px solid $color-stroke-accent;
	}
}
</style>
