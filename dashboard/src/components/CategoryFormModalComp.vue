<script lang="ts">
import { defineComponent } from "vue";
import AppModal from "./AppModal.vue";
import CategoryFormComp from "./CategoryFormComp.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapState } from "pinia";
import type { LanguageCode } from "@/types/translations";
import type { Category } from "@/types/categories";
import ImagePreviewComp from "./ImagePreviewComp.vue";
import CategoryCloseConfirmationModalComp from "./CategoryCloseConfirmationModalComp.vue";

export default defineComponent({
	name: "CategoryFormModalComp",
	components: { 
		AppModal, 
		CategoryFormComp, 
		ImagePreviewComp, 
		CategoryCloseConfirmationModalComp, 
	},
	props: {
		// If provided category id, then form will be in edit mode
		categoryId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["close"],
	data() {
		return {
			// Mark as changed to prevent closing modal without confirmation
			isChanged: false,
			showCloseConfirmationModal: false,
		};
	},
	computed: {
		...mapState(useCategoriesStore, ["getCategoryById"]),
		category(): Category | undefined {
			return this.categoryId ? this.getCategoryById(this.categoryId) : undefined;
		},
		title(): string {
			return this.categoryId ? this.$t("editing-category") : this.$t("creation-category");
		},
		subtitle(): string {
			return this.category?.[this.$i18n.locale as LanguageCode] || "";
		},
	},
	methods: {
		tryClose() {
			if (this.isChanged) {
				this.showCloseConfirmationModal = true;
			} else {
				this.close();
			}
		},
		close() {
			this.$emit("close");
		},
		setChanged(status: boolean) {
			this.isChanged = status;
		},
	},
});

</script>

<template>
	<AppModal
		:title="title"
		:subtitle="subtitle"
		@close="tryClose"
	>
		<template
			v-if="category"
			#header-left
		>
			<ImagePreviewComp
				:src="category.image"
				static
			/>
		</template>
		<template #content>
			<CategoryFormComp
				:category-id="categoryId"
				@saved="close"
				@close="tryClose"
				@set-changed-status="setChanged"
			/>
		</template>
	</AppModal>

	<CategoryCloseConfirmationModalComp
		v-if="showCloseConfirmationModal"
		:is-editing="Boolean(category)"
		@close="showCloseConfirmationModal = false"
		@confirm="close"
	/>
</template>

