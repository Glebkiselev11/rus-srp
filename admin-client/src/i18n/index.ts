import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ru from "./ru.json";
import srp from "./srp.json";

export default i18n
	.use(initReactI18next) 
	.init({
		resources: {
			en,
			ru,
			srp
		},
		lng: localStorage.getItem("languageKey") || "en",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false 
		}
	});

interface ILanguageList {
  lng: string,
  name: string,
}

export const LanguageList: ILanguageList[] = [
	{ lng: "en", name: "English" }, 
	{ lng: "ru", name: "Русский" },
	{ lng: "srp", name: "Srpski" }
];
