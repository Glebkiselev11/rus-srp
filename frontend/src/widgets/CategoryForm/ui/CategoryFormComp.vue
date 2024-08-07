<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref, watch, onMounted } from "vue";
import {
  useCreateCategory,
  useUpdateCategory,
  CategoriesService,
  type Category,
} from "@/entities/Category";
import { capitalizeFirstLetter } from "@/shared/lib";
import { useTranslateHelpers, type LanguageCode } from "@/shared/Translate";
import type { Id } from "@/shared/types";
import { ImageSectionComp } from "@/features/ImageExplorer";
import { InputComp } from "@/shared/ui/Input";
import { ButtonComp } from "@/shared/ui/Button";
import { useToaster } from "@/shared/ui/Toaster";
import { useDraftCategoryStore } from "../model/draftCategory";
import { storeToRefs } from "pinia";

const { getLanguageLabel, getLanguageList, getLanguageCodesOrder } =
  useTranslateHelpers();

const toaster = useToaster();
const { t, locale } = useI18n();
const createCategory = useCreateCategory();
const updateCategory = useUpdateCategory();

const emits = defineEmits<{
  (e: "created", id: Id): void;
  (e: "saved"): void;
  (e: "close"): void;
}>();

const draftCategoryStore = useDraftCategoryStore();
const {
  draftCategory,
  initialCategory,
  isEditMode,
  lastAutoFillRequestWord,
  autoFillTranslationsLoading,
} = storeToRefs(draftCategoryStore);

const categoryNameAlreadyExistsError = ref(false);
const rusValidationError = ref<string | undefined>(undefined);
const engValidationError = ref<string | undefined>(undefined);
const srp_latinValidationError = ref<string | undefined>(undefined);
const srp_cyrillicValidationError = ref<string | undefined>(undefined);
const savingLoading = ref(false);

const draftCategoryName = computed(
  () => draftCategory.value[selectedLanguage.value]
);

const showFillAutoButton = computed(() => {
  if (draftCategoryName.value === lastAutoFillRequestWord.value) {
    return false;
  }

  if (categoryNameAlreadyExistsError.value || !draftCategoryName.value) {
    return false;
  }

  const categoryName = initialCategory.value?.[selectedLanguage.value];

  if (categoryName && categoryName !== draftCategoryName.value) {
    return true;
  }

  const isAllFieldsFilled = getLanguageList().every(
    ({ value }) => draftCategory.value[value] !== ""
  );

  if (isAllFieldsFilled) {
    return false;
  }

  return true;
});

const selectedLanguage = computed(() => {
  return locale.value as LanguageCode;
});

const imageSearchModalSubtitle = computed(() => {
  return (
    capitalizeFirstLetter(draftCategory.value[selectedLanguage.value]) ||
    t("new-category")
  );
});

const translationError = computed(() => {
  return (
    rusValidationError.value ||
    engValidationError.value ||
    srp_latinValidationError.value ||
    srp_cyrillicValidationError.value
  );
});

const isValidToSave = computed(() => {
  return !categoryNameAlreadyExistsError.value && !translationError.value;
});

const fillInText = computed(() => {
  return isEditMode.value ? t("update") : t("fill-in-auto");
});

const categoryNameValidationError = computed(() => {
  if (categoryNameAlreadyExistsError.value) {
    return t("category-exists");
  }

  return getValidationError(selectedLanguage.value);
});

const defaultImageSearchQuery = computed(() => {
  return draftCategory.value.eng;
});

const saveButtonLabel = computed(() => {
  return isEditMode.value ? t("save-changes") : t("create");
});

const nonSelectedLanguages = computed(() => {
  return getLanguageCodesOrder().filter(
    (code) => code !== selectedLanguage.value
  );
});

watch(
  () => draftCategory.value.rus,
  () => {
    rusValidationError.value = undefined;
  }
);

watch(
  () => draftCategory.value.eng,
  () => {
    engValidationError.value = undefined;
  }
);

watch(
  () => draftCategory.value.srp_latin,
  () => {
    srp_latinValidationError.value = undefined;
  }
);

watch(
  () => draftCategory.value.srp_cyrillic,
  () => {
    srp_cyrillicValidationError.value = undefined;
  }
);

onMounted(() => {
  if (!isEditMode.value && draftCategoryName.value) {
    autoFill();
  }
});

function getValidationError(code: LanguageCode) {
  switch (code) {
    case "eng":
      return engValidationError.value;
    case "rus":
      return rusValidationError.value;
    case "srp_latin":
      return srp_latinValidationError.value;
    case "srp_cyrillic":
      return srp_cyrillicValidationError.value;
  }
}

async function autoFill() {
  await triggerCategoryNameUniqueValidation();

  if (!categoryNameAlreadyExistsError.value) {
    draftCategoryStore.autoFillTranslations();
  }
}

async function triggerCategoryNameUniqueValidation(): Promise<void> {
  const key = selectedLanguage.value;
  const name = draftCategoryName.value;

  if (!name || (initialCategory.value && initialCategory.value[key] === name)) {
    categoryNameAlreadyExistsError.value = false;
    return;
  }

  try {
    const { categories } = await CategoriesService.query({ search: name });

    const exists = categories.some(
      (category) =>
        category[key].toLocaleLowerCase() === name.toLocaleLowerCase()
    );

    categoryNameAlreadyExistsError.value = exists;
  } catch (_) {}
}

async function triggerValidation(): Promise<void> {
  await triggerCategoryNameUniqueValidation();

  const requiredError = t("required");
  if (!draftCategory.value.rus) {
    rusValidationError.value = requiredError;
  } else {
    rusValidationError.value = undefined;
  }

  if (!draftCategory.value.eng) {
    engValidationError.value = requiredError;
  } else {
    engValidationError.value = undefined;
  }

  if (!draftCategory.value.srp_latin) {
    srp_latinValidationError.value = requiredError;
  } else {
    srp_latinValidationError.value = undefined;
  }

  if (!draftCategory.value.srp_cyrillic) {
    srp_cyrillicValidationError.value = requiredError;
  } else {
    srp_cyrillicValidationError.value = undefined;
  }
}

async function saveCategory() {
  await triggerValidation();

  if (!isValidToSave.value) {
    return;
  }

  savingLoading.value = true;
  if (isEditMode.value) {
    await updateCategory.mutateAsync({
      ...draftCategory.value,
    } as Category);

    toaster.addToast({
      type: "success",
      message: t("changes-saved"),
    });
  } else {
    const { data } = await createCategory.mutateAsync(draftCategory.value);
    toaster.addToast({
      type: "success",
      message: t("category-created-successfully", {
        category: data[selectedLanguage.value],
      }),
    });
    emits("created", data.id);
  }

  savingLoading.value = false;

  emits("saved");
}

function close() {
  emits("close");
}
</script>

<template>
  <div class="category-form">
    <div class="category-form__content">
      <ImageSectionComp
        :src="draftCategory.image"
        :image-search-modal-subtitle="imageSearchModalSubtitle"
        :default-image-search-query="defaultImageSearchQuery"
        @update:src="draftCategory.image = $event"
      >
        <InputComp
          v-model="draftCategory[selectedLanguage]"
          :label="t('category-name')"
          width="400px"
          appearance="outline"
          :focus-on-mount="!isEditMode"
          :error-text="categoryNameValidationError"
          clear-button
          @update:model-value="triggerCategoryNameUniqueValidation"
          @keypress.enter="autoFill"
        />
      </ImageSectionComp>

      <div class="category-form__row">
        <h4 v-text="t('translation')" />

        <ButtonComp
          v-if="showFillAutoButton"
          icon="edit_note"
          appearance="inline"
          size="regular"
          :label="fillInText"
          :loading="autoFillTranslationsLoading"
          @click="autoFill"
        />
      </div>

      <InputComp
        v-for="code in nonSelectedLanguages"
        :key="code"
        v-model="draftCategory[code]"
        appearance="outline"
        clear-button
        :error-text="getValidationError(code)"
        :label="getLanguageLabel(code)"
        class="category-form__translation-input"
      />
    </div>

    <div class="category-form__footer">
      <ButtonComp appearance="secondary" :label="t('cancel')" @click="close" />
      <ButtonComp
        :label="saveButtonLabel"
        :loading="savingLoading"
        @click="saveCategory"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-form {
  width: 598px;

  &__content {
    padding-inline: 20px;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    margin-block: 16px 20px;
  }

  &__translation-input {
    margin-block-end: 24px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    column-gap: 8px;
    padding: 20px;
    border-block-start: 1px solid $color-separator-primary;
  }
}
</style>
