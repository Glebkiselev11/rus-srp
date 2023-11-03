import { createI18n } from "vue-i18n";
import eng from "@/locales/eng.json";
import rus from "@/locales/rus.json";
import srpLatin from "@/locales/srp_latin.json";
import srpCyrillic from "@/locales/srp_cyrillic.json";

export const STORAGE_KEY = "languageKey";

export type LanguageCode = "eng" | "rus" | "srp_latin" | "srp_cyrillic";

export const LanguageList = [
	{ value: "eng", label: "English" },
	{ value: "rus", label: "Русский" },
	{ value: "srp_latin", label: "Srpski" },
	{ value: "srp_cyrillic", label: "Српски" },
] as { value: LanguageCode; label: string }[];

export default createI18n({
	locale: localStorage.getItem(STORAGE_KEY) || "eng",
	messages: {
		eng,
		rus,
		"srp_latin": srpLatin,
		"srp_cyrillic": srpCyrillic,
	},
});
