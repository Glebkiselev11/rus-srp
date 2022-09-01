import { useTranslation } from "react-i18next";
import { LanguageList } from "../i18n";

export function LanguageChanger() {
	const { i18n } = useTranslation();

	const handleChangeLanguage = (code: string) => {
		i18n.changeLanguage(code);
		localStorage.setItem("languageKey", code);
	};

	return (
		<select name="language" onChange={e => handleChangeLanguage(e.target.value)}>
			{LanguageList.map(l => 
				<option key={l.lng} value={l.lng}>{l.name}</option>
			)}
		</select>
	);
}
