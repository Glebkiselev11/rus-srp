<script lang="ts">
import { defineComponent, type PropType } from "vue";
import ImageSectionComp from "./ImageSectionComp.vue";
import { useCategoriesActions } from "@/stores/categories/actions";
import { mapActions } from "pinia";
import type { Category, DraftCategory } from "@/types/categories";
import type { LanguageCode } from "@/types/translations";
import InputComp from "./InputComp.vue";
import ButtonComp from "./ButtonComp.vue";
import { translate } from "@/common/translations";
import { CategoriesApi } from "@/api/categories";
import { getLanguageLabel, getLanguageList, getLanguageCodesOrder } from "@/common/translations";
import { isAnyFieldHasChanged } from "@/common/utils";

function initDraftCategory(): DraftCategory {
	return {
		rus: "",
		eng: "",
		srp_latin: "",
		srp_cyrillic: "",
		image: null,
	};
}

export default defineComponent({
	name: "CategoryFormComp",
	components: { 
		ImageSectionComp,
		InputComp, 
		ButtonComp, 
	},
	props: {
		category: {
			type: Object as PropType<Category>,
			default: undefined,
		},
	},
	emits: ["saved", "close", "set-changed-status"],
	data() {
		return {
			draftCategory: initDraftCategory(),
			categoryNameValidationErrors: [] as string[],
			rusValidationError: undefined as string | undefined,
			engValidationError: undefined as string | undefined,
			srp_latinValidationError: undefined as string | undefined,
			srp_cyrillicValidationError: undefined as string | undefined,
		};
	},

	computed: {
		selectedLanguage(): LanguageCode {
			return this.$i18n.locale as LanguageCode;
		},
		nonSelectedLanguages(): LanguageCode[] {
			return getLanguageCodesOrder()
				.filter((code) => code !== this.selectedLanguage);
		},
		categoryName(): string {
			return this.draftCategory[this.selectedLanguage];
		},	
		defaultImageSearchQuery(): string {
			return this.draftCategory.eng;
		},
		saveButtonLabel(): string {
			return this.category ? this.$t("save-changes") : this.$t("create");
		},
		showFillAutoButton(): boolean {
			const draftCategoryName = this.draftCategory[this.selectedLanguage];

			if (!draftCategoryName) {
				return false;
			}
			
			const categoryName = this.category?.[this.selectedLanguage];	

			if (categoryName && categoryName !== draftCategoryName) {
				return true;
			}

			const isAllFieldsFilled = getLanguageList().every(({ value }) => 
				this.draftCategory[value] !== "");

			if (isAllFieldsFilled) {
				return false;
			}
			
			return true;
		},
		isValidToSave(): boolean {
			return this.categoryNameValidationErrors.length === 0 &&
				!this.translationError;	
		},
		translationError(): string | undefined {
			return this.rusValidationError ||
				this.engValidationError ||
				this.srp_latinValidationError ||
				this.srp_cyrillicValidationError;
		},
	},
	watch: {
		draftCategory: {
			handler() {
				this.updateChangeStatus();
			},
			deep: true,
		},
	},
	created() {
		if (this.category) {
			this.draftCategory = { ...this.category };
		}
	},
	methods: {
		...mapActions(useCategoriesActions, ["createCategory", "updateCategory"]),
		getLanguageLabel,
		removeCategoryNameErrorValidation(error: string): void {
			this.categoryNameValidationErrors = this.categoryNameValidationErrors.filter(
				(x) => x !== error,
			);
		},	
		addCategoryNameErrorValidation(error: string): void {
			this.categoryNameValidationErrors.push(error);
			this.categoryNameValidationErrors = [...new Set(this.categoryNameValidationErrors)];
		},
		async triggerCategoryNameUniqueValidation(): Promise<void> {
			const key = this.selectedLanguage;
			const name = this.draftCategory[key];
			const error = this.$t("category-exists");

			if (!name || this.category && this.category[key] === name) {
				this.removeCategoryNameErrorValidation(error);
				return;
			}

			const { data } = await CategoriesApi.query({ search: name });

			const exists = data.result.some((category) => 
				category[key].toLocaleLowerCase() === name.toLocaleLowerCase());
			
			if (exists) {
				this.addCategoryNameErrorValidation(error);	
			} else {
				this.removeCategoryNameErrorValidation(error);
			}
		},
		async triggerValidation(): Promise<void> {
			await this.triggerCategoryNameUniqueValidation();

			const requiredError = this.$t("required");
			if (!this.draftCategory.rus && this.selectedLanguage !== "rus") {
				this.rusValidationError = requiredError;
			} else {
				this.rusValidationError = undefined;
			}

			if (!this.draftCategory.eng && this.selectedLanguage !== "eng") {
				this.engValidationError = requiredError;
			} else {
				this.engValidationError = undefined;
			}

			if (!this.draftCategory.srp_latin && this.selectedLanguage !== "srp_latin") {
				this.srp_latinValidationError = requiredError;
			} else {
				this.srp_latinValidationError = undefined;
			}

			if (!this.draftCategory.srp_cyrillic && this.selectedLanguage !== "srp_cyrillic") {
				this.srp_cyrillicValidationError = requiredError;
			} else {
				this.srp_cyrillicValidationError = undefined;
			}

			if (!this.draftCategory[this.selectedLanguage]) {
				this.addCategoryNameErrorValidation(this.$t("category-name-required"));
			} else {
				this.removeCategoryNameErrorValidation(this.$t("category-name-required"));
			}
		},
		async saveCategory() {
			await this.triggerValidation();

			if (!this.isValidToSave) {
				return;
			}

			if (this.category) {
				await this.updateCategory(this.category.id, this.draftCategory);
			} else {
				await this.createCategory(this.draftCategory);
			}

			this.$emit("saved");
		},
		autoFill() {
			const from = this.selectedLanguage;
			const target = getLanguageList()
				.filter(({ value }) => value !== from)
				.map(({ value }) => value);

			translate(from, this.draftCategory[from], target).then((translations) => {
				translations.forEach(({ to, text }) => {
					this.draftCategory[to] = text.toLowerCase();
				});
			});
		},
		close() {
			this.$emit("close");
		},
		updateChangeStatus() {
			const emit = "set-changed-status";
			if (this.category) {
				this.$emit(emit, isAnyFieldHasChanged(this.category, this.draftCategory));
			} else {
				this.$emit(emit, isAnyFieldHasChanged(initDraftCategory(), this.draftCategory));
			}
		},
		getValidationError(code: LanguageCode) {
			switch (code) {
			case "eng":
				return this.engValidationError;
			case "rus":
				return this.rusValidationError;
			case "srp_latin":
				return this.srp_latinValidationError;
			case "srp_cyrillic":
				return this.srp_cyrillicValidationError;
			}
		},
	},

});
</script>

<template>
	<div class="category-form">
		<ImageSectionComp
			:src="draftCategory.image"
			:image-search-modal-subtitle="categoryName"
			:default-image-search-query="defaultImageSearchQuery"
			@update:src="draftCategory.image = $event"	
		>
			<InputComp
				v-model="draftCategory[selectedLanguage]"
				:label="$t('category-name')"
				width="400px"
				appearance="outline"
				:focus-on-mount="!category"
				:error-text="categoryNameValidationErrors[0]"
				clear-button
				:reset-value="category?.[selectedLanguage]"
				@focusout="triggerCategoryNameUniqueValidation"
			/>
		</ImageSectionComp>

		<div class="category-form__row">
			<div>
				<h4 v-text="$t('translation')" />
				<span
					class="text-color-negative text-body-2"
					v-text="translationError"
				/>
			</div>

			<ButtonComp
				v-show="showFillAutoButton"
				icon="edit_note"
				appearance="inline"
				size="regular"
				:label="$t('fill-in-auto')"
				@click="autoFill"
			/>
		</div>

		<InputComp
			v-for="code in nonSelectedLanguages"
			:key="code"
			v-model="draftCategory[code]"
			appearance="outline"
			clear-button
			:reset-value="category?.[code]"
			:error-text="getValidationError(code)"
			:label="getLanguageLabel(code)"
			class="category-form__translation-input"
		/>

		<div class="category-form__footer">
			<ButtonComp
				appearance="secondary"
				:label="$t('cancel')"	
				@click="close"
			/>
			<ButtonComp
				:label="saveButtonLabel"
				@click="saveCategory"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.category-form {
	padding-inline: 16px;
	padding-block-end: 20px;
	width: 598px;

	&__row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 40px;
		margin-block-start: 16px;
		margin-block-end: 20px;
	}
	
	&__translation-input {
		margin-block-end: 24px;
	}

	&__footer {
		display: flex;
		justify-content: flex-end;
		column-gap: 8px;
		padding-block-start: 16px;
	}
}
</style>
