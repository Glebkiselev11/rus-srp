<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppInput from "./AppInput.vue";
import AppIcon from "./AppIcon/index.vue";
import { addCropImagaeParamsToUrl } from "@/utils";

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
		};
	},
	methods: {
		addCropImagaeParamsToUrl,
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
		</section>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-image-search {
	inline-size: 946px;
	block-size: 733px;
	max-block-size: 80vh;
	padding: 12px;
}

.app-image-search-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-block-start: 20px;

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
