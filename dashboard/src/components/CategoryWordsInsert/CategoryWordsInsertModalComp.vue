<!-- Component for adding words into category -->
<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "../ModalComp.vue";
import { mapState } from "pinia";
import { useCategoriesActions } from "@/stores/categories/actions";
import { addCropImagaeParamsToUrl } from "@/common/utils";
import { extractCurrentLanguageTranslation } from "@/common/translations";
import ImagePreviewComp from "../ImagePreviewComp.vue";
import CategoryWordsInsertComp from "./CategoryWordsInsertComp.vue";

export default defineComponent({
	name: "CategoryWordsInsertModalComp",
	components: {
		ModalComp,
		ImagePreviewComp,
		CategoryWordsInsertComp,
	},
	props: {
		categoryId: {
			type: Number,
			required: true,
		},
	},
	emits: ["close"],	
	computed: {
		...mapState(useCategoriesActions, ["getCategoryById"]),
		category() {
			return this.getCategoryById(this.categoryId);
		},
		srcWithParams(): string {
			const src = this.category?.image;
			return src ? addCropImagaeParamsToUrl(src, 200) : "";
		},
		subtitle() {
			return this.category ? extractCurrentLanguageTranslation(this.category) : "";
		},
	},
	methods: {
		close() {
			this.$emit("close");
		},
	},
});

</script>

<template>
	<ModalComp
		:title="$t('adding-words-into-category')"
		:subtitle="subtitle"
		@close="close"
	>
		<template #header-left>
			<ImagePreviewComp
				:src="srcWithParams"
				static
			/>
		</template>
		<template #content>
			<CategoryWordsInsertComp
				:category-id="categoryId"
			/>
		</template>
	</ModalComp>
</template>
