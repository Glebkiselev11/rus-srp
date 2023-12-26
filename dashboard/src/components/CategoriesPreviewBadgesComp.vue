<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Category } from "@/types/categories";
import { extractCurrentLanguageTranslation } from "@/common/translations";
import ImagePreviewComp from "./ImagePreviewComp.vue";

export default defineComponent({
	name: "CategoriesPreviewBadgesComp",
	components: {
		ImagePreviewComp,
	},
	props: {
		categories: {
			type: Array as PropType<Category[]>,
			required: true,
		},
	},
	data() {
		return {
			maxImages: 3,
		};
	},
	computed: {
		images() {
			return this.categories
				.map((category) => category.image)
				.slice(0, this.maxImages);
		},
		categoryNames() {
			return this.categories
				.map((category) => extractCurrentLanguageTranslation(category))
				.join(", ");
		},
		howManyMoreImages() {
			return this.categories.length - this.maxImages;
		},
	},
});

</script>

<template>
	<div class="categories-preview-badges">
		<div class="categories-preview-badges__images">
			<div
				v-for="(src, i) in images"
				:key="i"
			>
				<ImagePreviewComp
					:src="src"
					size="24px"
					static
				/>
			</div>

			<div
				v-if="howManyMoreImages > 0"
				class="categories-preview-badges__more-images-label"
			>
				+{{ howManyMoreImages }}
			</div>
		</div>

		<span class="categories-preview-badges__names">{{ categoryNames }}</span>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.categories-preview-badges {
  display: flex;
  align-items: center;
	width: 100%;
  overflow: hidden;

  &__images {
    margin-right: 14px;
    display: flex;

    div {
      margin-right: -6px;
    }
  }

  &__more-images-label {
		@include text-caption-2;
    width: 24px;
    height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		border: 1px solid $color-image-border;
		background: $color-image-placeholder;
		color: $color-text-primary;
		z-index: 1;
  }

	&__names {
		@include text-body-2;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

</style>
