import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import srp from "@/locales/srp.json";

export default createI18n({
	locale: "en",
	messages: {
		en,
		ru,
		srp,
	},
});
