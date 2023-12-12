<script lang="ts">
import { defineComponent } from "vue";
import ModalComp from "./ModalComp.vue";
import CategoryFormComp from "./CategoryFormComp.vue";
import { useCommonCategories } from "@/stores/categories/commonCategories";
import { mapState } from "pinia";
import type { LanguageCode } from "@/types/translations";
import type { Category } from "@/types/categories";
import ImagePreviewComp from "./ImagePreviewComp.vue";
import FormCloseConfirmationModalComp from "./FormCloseConfirmationModalComp.vue";

export default defineComponent({
	name: "CategoryFormModalComp",
	components: { 
		ModalComp, 
		CategoryFormComp, 
		ImagePreviewComp, 
		FormCloseConfirmationModalComp, 
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
		...mapState(useCommonCategories, ["getCategoryById"]),
		category(): Category | undefined {
			return this.categoryId ? this.getCategoryById(this.categoryId) : undefined;
		},
		title(): string {
			return this.categoryId ? this.$t("editing-category") : this.$t("creation-category");
		},
		subtitle(): string {
			return this.category?.[this.$i18n.locale as LanguageCode] || "";
		},
		closeConfirmationTitle() {
			return Boolean(this.category) 
				? this.$t("modal-exit-confirmation.edit-category-title")
				: this.$t("modal-exit-confirmation.creation-category-title"); 
		},
		closeConfirmationCancelButtonLabel() {
			return Boolean(this.category)
				? this.$t("modal-exit-confirmation.continue-editing")
				: this.$t("modal-exit-confirmation.continue-creation");
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
	<ModalComp
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
				:category="category"
				@saved="close"
				@close="tryClose"
				@set-changed-status="setChanged"
			/>
		</template>
	</ModalComp>

	<FormCloseConfirmationModalComp
		v-if="showCloseConfirmationModal"
		:title="closeConfirmationTitle"
		:cancel-button-label="closeConfirmationCancelButtonLabel"
		@close="showCloseConfirmationModal = false"
		@confirm="close"
	/>
</template>

