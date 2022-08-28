import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
	.use(initReactI18next) 
	.init({
		resources: {
			en: {
				translation: {
					"add-new-word": "Add new word",
					"save": "Save"
				}
			},
			ru: {
				translation: {
					"add-new-word": "Добавить новое слово",
					"save": "Сохранить"
				}
			}
		},
		lng: "en", 
		fallbackLng: "en",
		interpolation: {
			escapeValue: false 
		}
	});

export default i18n;
