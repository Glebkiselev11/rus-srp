import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { LanguageCode, TranslationObject } from "./types";
import { getLanguageLabel } from "../lib";

export function useTranslateHelpers() {
  const { locale } = useI18n();

  const currentLanguage = computed(() => locale.value as LanguageCode);

  function getLanguageCodesOrder(): LanguageCode[] {
    switch (currentLanguage.value) {
      case "eng":
        return ["eng", "srp_latin", "srp_cyrillic", "rus"];
      case "rus":
        return ["rus", "srp_cyrillic", "srp_latin", "eng"];
      case "srp_latin":
        return ["srp_latin", "eng", "srp_cyrillic", "rus"];
      case "srp_cyrillic":
        return ["srp_cyrillic", "rus", "srp_latin", "eng"];
    }
  }

  function getLanguageList() {
    return getLanguageCodesOrder().map((value) => ({
      value,
      label: getLanguageLabel(value),
    }));
  }

  function translationPreview(obj: TranslationObject): string {
    return getLanguageCodesOrder()
      .map((key) => obj[key])
      .map((x) => (Boolean(x) ? x : " ? "))
      .join(" — ");
  }

  function extractCurrentLanguageTranslation(obj: TranslationObject): string {
    return obj[locale.value as LanguageCode];
  }

  return {
    currentLanguage,
    getLanguageCodesOrder,
    getLanguageLabel,
    getLanguageList,
    translationPreview,
    extractCurrentLanguageTranslation,
  };
}
