import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import srp from "@/locales/srp.json";

export const STORAGE_KEY = "languageKey";

export const LanguageList = [
	{ value: "en", label: "English" },
	{ value: "ru", label: "Русский" },
	{ value: "srp", label: "Srpski" },
];


export default createI18n({
	locale: localStorage.getItem(STORAGE_KEY) || "en",
	messages: {
		en,
		ru,
		srp,
	},
});
