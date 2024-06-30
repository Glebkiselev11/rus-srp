import { createI18n } from "vue-i18n";
import eng from "./translations/eng.json";
import rus from "./translations/rus.json";
import srpLatin from "./translations/srp_latin.json";
import srpCyrillic from "./translations/srp_cyrillic.json";
import { slavicPluralizationRule } from "./lib";
import { STORAGE_KEY } from "./config";

export { default as LanguageSelectComp } from "./ui/LanguageSelectComp.vue";

export { STORAGE_KEY };

export const i18n = createI18n({
  legacy: false,
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
