<script lang="ts">
import { defineComponent } from "vue";
import AppModal from "./AppModal.vue";
import AppCategoryForm from "./AppCategoryForm.vue";

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
		title(): string {
			return this.categoryId ? this.$t("editing-category") : this.$t("creation-category");
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
		:visible="visible"
		@update:visible="updateVisible"
	>
		<template #content>
			<AppCategoryForm :category-id="categoryId" />
		</template>
	</AppModal>
</template>
