<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppInput from "./AppInput.vue";
import { addCropImagaeParamsToUrl } from "@/utils";

export default defineComponent({
	name: "AppImagesSearch",
	components: {
		AppInput,
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
			<img
				v-if="savedLink"
				class="app-image-search-list--image"
				:src="addCropImagaeParamsToUrl(savedLink, 300)"
			>
		</section>
	</div>
</template>

<style lang="scss" scoped>

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
</style>
