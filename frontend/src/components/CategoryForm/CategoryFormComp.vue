<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref, watch } from "vue";
import { CategoriesService } from "@/api";
import { useCategoriesActions } from "@/stores/categories/actions";
import { capitalizeFirstLetter, isAnyFieldHasChanged } from "@/common/utils";
import {
  getLanguageLabel,
  getLanguageList,
  getLanguageCodesOrder,
  translate,
} from "@/common/translations";
import type { Category, DraftCategory } from "@/types/categories";
import type { LanguageCode } from "@/types/translations";
import ImageSectionComp from "../ImageSectionComp.vue";
import InputComp from "../InputComp.vue";
import ButtonComp from "../ButtonComp.vue";

const { t, locale } = useI18n();
const categoryActions = useCategoriesActions();

const props = defineProps<{
  category?: Category;
}>();

const emits = defineEmits<{
  (e: "created", id: number): void;
  (e: "saved"): void;
  (e: "close"): void;
  (e: "set-changed-status", status: boolean): void;
}>();

const draftCategory = ref(initDraftCategory());
const autoFillTranslationsLoading = ref(false);
const categoryNameAlreadyExistsError = ref(false);
const rusValidationError = ref<string | undefined>(undefined);
const engValidationError = ref<string | undefined>(undefined);
const srp_latinValidationError = ref<string | undefined>(undefined);
const srp_cyrillicValidationError = ref<string | undefined>(undefined);
const savingLoading = ref(false);

const showFillAutoButton = computed(() => {
  const draftCategoryName = draftCategory.value[selectedLanguage.value];

  if (categoryNameAlreadyExistsError.value || !draftCategoryName) {
    return false;
  }

  const categoryName = props.category?.[selectedLanguage.value];

  if (categoryName && categoryName !== draftCategoryName) {
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
  const inEditMode = Boolean(props.category);
  return inEditMode ? t("update") : t("fill-in-auto");
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
  return props.category ? t("save-changes") : t("create");
});

const nonSelectedLanguages = computed(() => {
  return getLanguageCodesOrder().filter(
    (code) => code !== selectedLanguage.value
  );
});

watch(
  draftCategory,
  () => {
    updateChangeStatus();
  },
  { deep: true }
);

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
  if (props.category) {
    draftCategory.value = { ...props.category };
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

function autoFill() {
  if (!showFillAutoButton.value || autoFillTranslationsLoading.value) {
    return;
  }

  const from = selectedLanguage.value;
  const targets = getLanguageList()
    .filter(({ value }) => value !== from)
    .map(({ value }) => value)
    .reduce(
      (acc, cur) => {
        acc[cur] = "";
        return acc;
      },
      {} as Record<LanguageCode, string>
    );

  autoFillTranslationsLoading.value = true;

  translate({
    [from]: draftCategory.value[from],
    ...targets,
  })
    .then((translations) => {
      draftCategory.value = {
        ...draftCategory.value,
        ...translations,
      };
    })
    .finally(() => {
      autoFillTranslationsLoading.value = false;
    });
}

async function triggerCategoryNameUniqueValidation(): Promise<void> {
  const key = selectedLanguage.value;
  const name = draftCategory.value[key];

  if (!name || (props.category && props.category[key] === name)) {
    categoryNameAlreadyExistsError.value = false;
    return;
  }

  try {
    const { data } = await CategoriesService.query({ search: name });

    const exists = data.result.some(
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
  if (props.category) {
    await categoryActions.updateCategory(
      props.category.id,
      draftCategory.value
    );
  } else {
    const { id } = await categoryActions.createCategory(draftCategory.value);
    emits("created", id);
  }

  savingLoading.value = false;

  emits("saved");
}

function updateChangeStatus() {
  if (props.category) {
    emits(
      "set-changed-status",
      isAnyFieldHasChanged(props.category, draftCategory.value)
    );
  } else {
    emits(
      "set-changed-status",
      isAnyFieldHasChanged(initDraftCategory(), draftCategory.value)
    );
  }
}

function initDraftCategory(): DraftCategory {
  return {
    rus: "",
    eng: "",
    srp_latin: "",
    srp_cyrillic: "",
    image: null,
  };
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
          :label="$t('category-name')"
          width="400px"
          appearance="outline"
          :focus-on-mount="!props.category"
          :error-text="categoryNameValidationError"
          clear-button
          @input="triggerCategoryNameUniqueValidation"
          @keypress.enter="autoFill"
        />
      </ImageSectionComp>

      <div class="category-form__row">
        <h4 v-text="$t('translation')" />

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
      <ButtonComp appearance="secondary" :label="$t('cancel')" @click="close" />
      <ButtonComp
        :label="saveButtonLabel"
        :loading="savingLoading"
        @click="saveCategory"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

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
