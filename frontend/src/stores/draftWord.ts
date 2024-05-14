import type { DraftWord, Word } from "@/types/words";
import { defineStore } from "pinia";
import { convertWordToDraftWord, isAnyFieldHasChanged } from "@/common/utils";
import { translate } from "@/common/translations";
import { useTranslations } from "@/common/useTranslations";
import { computed, ref } from "vue";

function _initDraftWord(): DraftWord {
  return {
    rus: "",
    eng: "",
    srp_latin: "",
    srp_cyrillic: "",
    image: null,
    category_ids: [],
    translation_approved: false,
  };
}

export const useDraftWordStore = defineStore("draftWord", () => {
  const { getLanguageCodesOrder } = useTranslations();

  const draftWord = ref(_initDraftWord());
  const uniqueWordError = ref(false);
  const autoFillTranslationsLoading = ref(false);
  // if we are in editing mode, we need to store the initial word
  const initialWord = ref<DraftWord>();

  const translations = computed(() => {
    return [
      draftWord.value.rus,
      draftWord.value.eng,
      draftWord.value.srp_latin,
      draftWord.value.srp_cyrillic,
    ];
  });

  const anyTranslationFilled = computed(() => {
    return translations.value.some((x) => Boolean(x));
  });

  const allTranslationsFilled = computed(() => {
    return translations.value.every((x) => Boolean(x));
  });

  const semifilledTranslations = computed(() => {
    return anyTranslationFilled.value && !allTranslationsFilled.value;
  });

  const isEditMode = computed(() => {
    return Boolean(initialWord.value);
  });

  const isChanged = computed(() => {
    if (initialWord.value) {
      return isAnyFieldHasChanged(initialWord.value, draftWord.value);
    } else {
      return isAnyFieldHasChanged(_initDraftWord(), draftWord.value);
    }
  });

  const isTranslationChanged = computed(() => {
    const initialWordValue = initialWord.value;

    if (initialWordValue) {
      const keys = getLanguageCodesOrder();
      return keys.some((key) => initialWordValue[key] !== draftWord.value[key]);
    }
    return false;
  });

  function initDraftWord(word?: Word) {
    if (word) {
      const _word = convertWordToDraftWord(word);

      draftWord.value = structuredClone(_word);
      initialWord.value = structuredClone(_word);
    } else {
      draftWord.value = _initDraftWord();
      initialWord.value = undefined;
    }
  }

  function resetDraftWord() {
    initDraftWord();
  }

  function resetTranslationApproved() {
    draftWord.value.translation_approved =
      initialWord.value?.translation_approved || false;
  }

  async function autoFillTranslations() {
    autoFillTranslationsLoading.value = true;
    const fields = await translate(draftWord.value);
    draftWord.value = {
      ...draftWord.value,
      ...fields,
    };
    autoFillTranslationsLoading.value = false;
  }

  return {
    draftWord,
    initialWord,
    translations,
    anyTranslationFilled,
    allTranslationsFilled,
    semifilledTranslations,
    isEditMode,
    isChanged,
    isTranslationChanged,
    uniqueWordError,
    autoFillTranslationsLoading,
    initDraftWord,
    resetDraftWord,
    resetTranslationApproved,
    autoFillTranslations,
  };
});
