<script lang="ts">
import { defineComponent } from "vue";
import ImagePreviewComp from "./ImagePreviewComp.vue";
import { useCategoriesStore } from "@/stores/categories";
import { mapActions, mapState } from "pinia";
import type { Category, DraftCategory } from "@/types/categories";
import { LanguageList } from "@/i18n";
import type { LanguageCode } from "@/types/translations";
import AppInput from "./AppInput.vue";
import ButtonComp from "./ButtonComp.vue";
import { translate } from "@/common/translations";
import { CategoriesApi } from "@/api/categories";

export default defineComponent({
	name: "CategoryFormComp",
	components: { ImagePreviewComp, AppInput, ButtonComp },
	props: {
		categoryId: {
			type: Number,
			default: undefined,
		},
	},
	emits: ["saved", "close", "set-changed-status"],
	data() {
		return {
			draftCategory: {
				rus: "",
				eng: "",
				srp_latin: "",
				srp_cyrillic: "",
				image: null,
			} as DraftCategory,
			categoryNameValidationErrors: [] as string[],
			rusValidationError: undefined as string | undefined,
			engValidationError: undefined as string | undefined,
			srp_latinValidationError: undefined as string | undefined,
			srp_cyrillicValidationError: undefined as string | undefined,
		};
	},

	computed: {
		...mapState(useCategoriesStore, ["getCategoryById"]),
		category(): Category | undefined {
			return this.categoryId ? this.getCategoryById(this.categoryId) : undefined;
		},
		selectedLanguage(): LanguageCode {
			return this.$i18n.locale as LanguageCode;
		},
		categoryName(): string {
			return this.draftCategory[this.selectedLanguage];
		},	
		defaultImageSearchQuery(): string {
			return this.draftCategory.eng;
		},
		saveButtonLabel(): string {
			return this.categoryId ? this.$t("save-changes") : this.$t("create");
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

			const isAllFieldsFilled = LanguageList.every(({ value }) => 
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
		...mapActions(useCategoriesStore, ["createCategory", "updateCategory"]),
		getLabelByKey(key: LanguageCode): string {
			return LanguageList.find(({ value }) => value === key)?.label || "Not found label";
		},
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
			const target = LanguageList
				.filter(({ value }) => value !== from).map(({ value }) => value);

			translate(from, target, this.draftCategory[from]).then((translations) => {
				translations.forEach(({ to, text }) => {
					this.draftCategory[to] = text.toLowerCase();
				});
			});
		},
		close() {
			this.$emit("close");
		},
		updateChangeStatus() {
			const getFields = (category: Category | DraftCategory) => [
				category.rus,
				category.eng,
				category.srp_latin,
				category.srp_cyrillic,
				category.image,
			];

			if (!this.categoryId) {
				const isAnyFilled = getFields(this.draftCategory).some((x) => x);
				this.$emit("set-changed-status", isAnyFilled);
			} else if (this.category) {
				const categoryFields = getFields(this.category);
				const draftCategoryFields = getFields(this.draftCategory);
				const isAnyChanged = categoryFields.some((x, i) => x !== draftCategoryFields[i]);
				this.$emit("set-changed-status", isAnyChanged);
			}
		},
	},

});
</script>

<template>
	<div class="category-form">
		<div class="category-form__preview">
			<ImagePreviewComp
				size="96px"
				:src="draftCategory.image"
				:image-search-modal-subtitle="categoryName"
				:default-image-search-query="defaultImageSearchQuery"
				@update:src="draftCategory.image = $event"
			/>

			<AppInput
				v-model="draftCategory[selectedLanguage]"
				:label="$t('category-name')"
				width="400px"
				appearance="outline"
				:focus-on-mount="!category"
				:error="categoryNameValidationErrors[0]"
				clear-button
				:reset-value="category?.[selectedLanguage]"
				@focusout="triggerCategoryNameUniqueValidation"
			/>
		</div>

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

		<AppInput
			v-if="selectedLanguage !== 'rus'"
			v-model="draftCategory.rus"
			appearance="outline"
			disable-error-label
			:error="rusValidationError"
			:reset-value="category?.rus"
			clear-button
			:label="getLabelByKey('rus')"
			class="category-form__translation-input"
		/>

		<AppInput
			v-if="selectedLanguage !== 'eng'"
			v-model="draftCategory.eng"
			appearance="outline"
			disable-error-label
			clear-button
			:reset-value="category?.eng"
			:error="engValidationError"
			:label="getLabelByKey('eng')"
			class="category-form__translation-input"
		/>

		<AppInput
			v-if="selectedLanguage !== 'srp_latin'"
			v-model="draftCategory.srp_latin"
			appearance="outline"
			disable-error-label
			clear-button
			:reset-value="category?.srp_latin"
			:error="srp_latinValidationError"
			:label="getLabelByKey('srp_latin')"
			class="category-form__translation-input"
		/>

		<AppInput
			v-if="selectedLanguage !== 'srp_cyrillic'"
			v-model="draftCategory.srp_cyrillic"
			appearance="outline"
			disable-error-label
			clear-button
			:reset-value="category?.srp_cyrillic"
			:error="srp_cyrillicValidationError"
			:label="getLabelByKey('srp_cyrillic')"
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

	&__preview {
		display: flex;
		column-gap: 24px;
		width: 100%;
		height: 144px;
		padding: 24px;
		background: $color-background;
		border-radius: 16px;
	}

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