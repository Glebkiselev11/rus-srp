<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import ImagePreviewComp from "@/components/ImagePreviewComp.vue";
import ListItemComp from "@/components/ListItemComp.vue";
import { highlighTextByQuery } from "@/common/utils";
import { extractCurrentLanguageTranslation } from "@/common/translations";

export default defineComponent({
	name: "WordFormCategoryItemComp",
	components: {
		ImagePreviewComp,
		ListItemComp,
	},
	props: {
		category: {
			type: Object as PropType<Category>,
			required: true,
		},
		query: {
			type: String,
			default: "",
		},
	},
	emits: ["selectCateogry"],
	methods: {
		highlighTextByQuery,
		extractCurrentLanguageTranslation,
		selectCategory() {
			this.$emit("selectCateogry", this.category.id);
		},
	},
});

</script>

<template>
	<ListItemComp
		clickable
		size="compact"
		padding-inline="8px"
		class="list-item"
		@click="selectCategory"
	>
		<div class="word-form-category-item">
			<div class="word-form-category-item__row">
				<ImagePreviewComp
					size="24px"
					:src="category.image"
					static
				/>

				<span
					class="word-form-category-item__label"
					v-html="highlighTextByQuery(extractCurrentLanguageTranslation(category), query)"
				/>
			</div>

			<div class="word-form-category-item__right-icon">
				<slot />
			</div>
		</div>
	</ListItemComp>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";
.word-form-category-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	&__row {
		display: inherit;
		align-items: inherit;
		column-gap: 8px;
	}

	&__label {
		@include text-body-2;
		&::first-letter {
			text-transform: uppercase;
		}
	}

  &__right-icon {
    visibility: hidden;
  }
}

.list-item:hover {
  .word-form-category-item__right-icon {
    visibility: visible;
  }
}

</style>
