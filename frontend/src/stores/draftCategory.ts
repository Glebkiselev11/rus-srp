import { isAnyFieldHasChanged } from "@/common/utils";
import type { Category, DraftCategory } from "@/types/categories";
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
  const draftCategory = ref<DraftCategory>(_initDraftCategory());
  const initialCategory = ref<DraftCategory>();

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
    }
  }

  function resetDraftCategory() {
    initDraftCategory();
  }

  return {
    draftCategory,
    isEditMode,
    isChanged,
    initDraftCategory,
    resetDraftCategory,
  };
});
