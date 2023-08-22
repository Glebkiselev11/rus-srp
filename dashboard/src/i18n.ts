import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import srpLatin from "@/locales/srp-latin.json";
import srpCyrillic from "@/locales/srp-cyrillic.json";

export const STORAGE_KEY = "languageKey";

export const LanguageList = [
	{ value: "en", label: "English" },
	{ value: "ru", label: "Русский" },
	{ value: "srp-latin", label: "Srpski" },
	{ value: "srp-cyrillic", label: "Српски" },
];

export type LanguageCode = "en" | "ru" | "srp-latin" | "srp-cyrillic";


export default createI18n({
	locale: localStorage.getItem(STORAGE_KEY) || "en",
	messages: {
		en,
		ru,
		"srp-latin": srpLatin,
		"srp-cyrillic": srpCyrillic,
	},
});
