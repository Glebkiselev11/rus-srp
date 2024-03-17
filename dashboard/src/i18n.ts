import { createI18n } from "vue-i18n";
import eng from "@/locales/eng.json";
import rus from "@/locales/rus.json";
import srpLatin from "@/locales/srp_latin.json";
import srpCyrillic from "@/locales/srp_cyrillic.json";

export const STORAGE_KEY = "languageKey";

function slavicPluralizationRule(choice: number, choicesLength: number) {
  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

export default createI18n({
  locale: localStorage.getItem(STORAGE_KEY) || "eng",
  pluralizationRules: {
    rus: slavicPluralizationRule,
    srp_latin: slavicPluralizationRule,
    srp_cyrillic: slavicPluralizationRule,
  },
  messages: {
    eng,
    rus,
    srp_latin: srpLatin,
    srp_cyrillic: srpCyrillic,
  },
});
