<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Category } from "@/types/categories";
import { extractCurrentLanguageTranslation } from "@/common/translations";
import ImagePreviewComp from "./ImagePreviewComp.vue";
import TooltipComp from "./TooltipComp.vue";
import ButtonComp from "./ButtonComp.vue";

export default defineComponent({
	name: "CategoriesPreviewBadgesComp",
	components: {
		ImagePreviewComp,
		TooltipComp,
		ButtonComp,
	},
	props: {
		categories: {
			type: Array as PropType<Category[]>,
			required: true,
		},
		showAddButton: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["click"],
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
	methods: {
		click(e: MouseEvent) {
			this.$emit("click", e);
		},
	},
});

</script>

<template>
	<TooltipComp
		v-if="categories.length > 0"
		:text="categoryNames"
		position="bottom"
		max-width="100%"
		text-wrap
		color="light"
		:hidden="images.length <= 1"
	>
		<button
			class="categories-preview-badges"
			@click="click"
		>
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
		</button>
	</TooltipComp>

	<ButtonComp
		v-else-if="showAddButton"
		:label="$t('add')"
		icon="add"
		appearance="inline"
		size="compact"
		@click="click"
	/>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.categories-preview-badges {
	$radius: 8px;

  display: flex;
  align-items: center;
	width: 100%;
  overflow: hidden;
	border: none;
	padding: 4px;
	border-radius: $radius;
	background: transparent;

	&:hover {
		cursor: pointer;
		background: $color-background-content-primary-hovered;
	}

  &__images {
    margin-right: 14px;
    display: flex;

    div {
      margin-right: -6px;
    }
  }

  &__more-images-label {
		@include text-caption-2;
    min-width: 24px;
    height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-inline: 4px;
		border-radius: $radius;
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
