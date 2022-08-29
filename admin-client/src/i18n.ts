import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
	.use(initReactI18next) 
	.init({
		resources: {
			"en": {
				translation: {
					"add-new-word": "Add new word",
					"save": "Save",
					"main": "Home",
					"admin-panel": "Admin Panel"
				}
			},
			"ru": {
				translation: {
					"add-new-word": "Добавить новое слово",
					"save": "Сохранить",
					"main": "Главная",
					"admin-panel": "Админ Панель"
				}
			},
			
		},
		lng: "en",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false 
		}
	});

export default i18n;
