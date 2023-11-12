<script lang="ts">
import type { Category } from "@/types/categories";
import { defineComponent, type PropType } from "vue";
import AppModal from "../AppModal.vue";
import type { LanguageCode } from "@/types/translations";
import { WordsApi } from "@/api";
import AppInput from "../AppInput.vue";
import ButtonComp from "../ButtonComp.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions } from "pinia";

export default defineComponent({
	name: "RemoveCategoryModalComp",
	components: {
		AppModal,
		AppInput,
		ButtonComp,
	},
	props: {
		category: {
			type: Object as PropType<Category>,
			required: true,
		},
	},
	emits: ["close"],
	data() {
		return {
			wordsInCategory: 0,
			confirmationInput: "",
		};
	},
	computed: {
		title() {
			return this.$t("category-removing.title", { 
				categoryName: this.category[this.$i18n.locale as LanguageCode], 
			});
		},
		subtitle() {
			return this.$tc("category-removing.subtitle", this.wordsInCategory);
		},
		confirmed() {
			const key = this.category[this.$i18n.locale as LanguageCode].toLocaleLowerCase();
			const input = this.confirmationInput.toLocaleLowerCase();
			return key === input;
		},
	},
	async mounted() {
		const { data } = await WordsApi.query({ category_id: this.category.id, limit: 0 });
		this.wordsInCategory = data.count;
	},
	methods: {
		...mapActions(useCategoriesStore, ["deleteCategory"]),
		close() {
			this.$emit("close");
		},
		async removeCategory() {
			await this.deleteCategory(this.category.id);
			this.close();
		},
	},
});

</script>

<template>
	<AppModal
		:title="title"
		:subtitle="subtitle"
		header-padding-inline="12px"
		@close="close"
	>
		<template #content>
			<div class="remove-category-modal">
				<span
					v-if="wordsInCategory > 0"
					class="remove-category-modal__description"
					v-text="$t('category-removing.description')"
				/>

				<AppInput
					v-model="confirmationInput"
					:label="$t('category-removing.confirmation-label')"
				/>

				<div class="remove-category-modal__buttons">
					<ButtonComp
						:label="$t('cancel')"
						color="neutral"
						appearance="secondary"
						@click="close"
					/>
					<ButtonComp
						:disabled="!confirmed"
						color="negative"
						:label="$t('yes-remove')"
						@click="removeCategory"
					/>
				</div>
			</div>
		</template>
	</AppModal>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.remove-category-modal {
	display: flex;
	flex-direction: column;
	padding: 12px;
	width: 480px;

	&__description {
		@extend .text-body-1;
		margin-block-end: 24px;
	}

	&__buttons {
		display: flex;
		justify-content: flex-end;
		margin-block-start: 20px;
		column-gap: 8px;
	}
}

</style>
