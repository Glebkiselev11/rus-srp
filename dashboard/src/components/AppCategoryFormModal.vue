<script lang="ts">
import { defineComponent } from "vue";
import AppModal from "./AppModal.vue";
import AppCategoryForm from "./AppCategoryForm.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapState } from "pinia";
import type { LanguageCode } from "@/i18n";
import type { Category } from "@/types/categories";
import AppImagePreview from "./AppImagePreview.vue";

export default defineComponent({
	name: "AppCategoryFormModal",
	components: { AppModal, AppCategoryForm, AppImagePreview },
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
		<template
			v-if="category"
			#header-left
		>
			<AppImagePreview
				:src="category.image"
				static
			/>
		</template>
		<template #content>
			<AppCategoryForm :category-id="categoryId" />
		</template>
	</AppModal>
</template>
