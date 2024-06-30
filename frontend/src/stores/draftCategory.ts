import { useI18n } from "vue-i18n";
import { isAnyFieldHasChanged } from "@/common/utils";
import {
  useTranslateHelpers,
  translate,
  type LanguageCode,
} from "@/shared/Translate";
import type { Category, DraftCategory } from "@/entities/Category";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

function _initDraftCategory(): DraftCategory {
  return {
    rus: "",
    eng: "",
    srp_latin: "",
    srp_cyrillic: "",
    image: null,
  };
}

export const useDraftCategoryStore = defineStore("draftCategory", () => {
  const { getLanguageList } = useTranslateHelpers();
  const { locale } = useI18n();

  const draftCategory = ref<DraftCategory>(_initDraftCategory());
  const initialCategory = ref<DraftCategory>();
  const autoFillTranslationsLoading = ref(false);
  const lastAutoFillRequestWord = ref("");

  const isEditMode = computed(() => {
    return Boolean(initialCategory.value);
  });

  const isChanged = computed(() => {
    if (initialCategory.value) {
      return isAnyFieldHasChanged(initialCategory.value, draftCategory.value);
    } else {
      return isAnyFieldHasChanged(_initDraftCategory(), draftCategory.value);
    }
  });

  function initDraftCategory(category?: Category) {
    if (category) {
      draftCategory.value = { ...category };
      initialCategory.value = { ...category };
    } else {
      draftCategory.value = _initDraftCategory();
      initialCategory.value = undefined;
    }
  }

  function resetDraftCategory() {
    initDraftCategory();
  }

  function autoFillTranslations() {
    if (autoFillTranslationsLoading.value) {
      return;
    }

    const from = locale.value as LanguageCode;
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
        lastAutoFillRequestWord.value = draftCategory.value[from];
      });
  }

  return {
    draftCategory,
    initialCategory,
    isEditMode,
    autoFillTranslationsLoading,
    lastAutoFillRequestWord,
    isChanged,
    autoFillTranslations,
    initDraftCategory,
    resetDraftCategory,
  };
});
