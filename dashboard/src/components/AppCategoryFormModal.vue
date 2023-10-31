<script lang="ts">
import { defineComponent } from "vue";
import AppModal from "./AppModal.vue";
import AppCategoryForm from "./AppCategoryForm.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapState } from "pinia";
import type { LanguageCode } from "@/i18n";

export default defineComponent({
	name: "AppCategoryFormModal",
	components: { AppModal, AppCategoryForm },
	props: {
		// If provided category id, then form will be in edit mode
		categoryId: {
			type: Number,
			default: undefined,
		},
		visible: {
			type: Boolean,
			required: true,
		},
	},
	emits: ["update:visible"],
	computed: {
		...mapState(useCategoriesStore, ["getCategoryById"]),
		title(): string {
			return this.categoryId ? this.$t("editing-category") : this.$t("creation-category");
		},
		subtitle(): string {
			if (this.categoryId) {
			  const category = this.getCategoryById(this.categoryId); 
				return category ? category[this.$i18n.locale as LanguageCode] : "";
			} else {
				return this.$t("new-category");
			}
		},
	},
	methods: {
		updateVisible(value: boolean) {
			this.$emit("update:visible", value);
		},
	},
});

</script>

<template>
	<AppModal
		:title="title"
		:subtitle="subtitle"
		:visible="visible"
		@update:visible="updateVisible"
	>
		<template #content>
			<AppCategoryForm :category-id="categoryId" />
		</template>
	</AppModal>
</template>
