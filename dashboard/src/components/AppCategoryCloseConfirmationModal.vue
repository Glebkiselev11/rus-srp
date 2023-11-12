<script lang="ts">
import { defineComponent } from "vue";
import AppModal from "./AppModal.vue";
import AppButton from "./AppButton.vue";

export default defineComponent({
	name: "AppCategoryCloseConfirmationModal",
	components: {
		AppModal,
		AppButton,
	},
	props: {
		isEditing: {
			type: Boolean,
			required: true,
		},
	},
	emits: ["close", "confirm"],
	computed: {
		title() {
			return this.isEditing 
				? this.$t("modal-exit-confirmation.edit-category-title")
				: this.$t("modal-exit-confirmation.creation-category-title"); 
		},
		cancelButtonLabel() {
			return this.isEditing
				? this.$t("modal-exit-confirmation.continue-editing")
				: this.$t("modal-exit-confirmation.continue-creation");
		},
	},
	methods: {
		close() {
			this.$emit("close");
		},
		confirm() {
			this.$emit("confirm");
		},
	},
});

</script>

<template>
	<AppModal
		:title="title"
		header-padding-inline="12px"
		@close="close"
	>
		<template #content>
			<div class="app-category-close-confirmation-modal">
				{{ $t("modal-exit-confirmation.description") }}

				<div class="app-category-close-confirmation-modal__buttons">
					<AppButton
						:label="cancelButtonLabel"
						appearance="secondary"
						@click="close"
					/>
					<AppButton
						:label="$t('modal-exit-confirmation.confirm')"
						@click="confirm"
					/>
				</div>
			</div>
		</template>
	</AppModal>
</template>

<style lang="scss" scoped>
.app-category-close-confirmation-modal {
  width: 502px;
  padding: 12px;

  &__buttons {
    display: flex;
    justify-content: flex-end;
    column-gap: 8px;
    margin-block-start: 32px;
  }
}

</style>
