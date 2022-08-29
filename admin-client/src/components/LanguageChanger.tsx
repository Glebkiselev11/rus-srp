import { useTranslation } from "react-i18next";

interface ILanguage {
  lng: string,
  name: string,
}

const List: ILanguage[] = [
	{ lng: "en", name: "English" }, 
	{ lng: "ru", name: "Русский" }
];

export function LanguageChanger() {
	const { i18n } = useTranslation();

	const handleChangeLanguage = (code: string) => {
		i18n.changeLanguage(code);
	};

	return (
		<select name="language" onChange={e => handleChangeLanguage(e.target.value)}>
			{List.map(l => 
				<option key={l.lng} value={l.lng}>{l.name}</option>
			)}
		</select>
	);
}
