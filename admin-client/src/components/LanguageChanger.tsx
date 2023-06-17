import { useTranslation } from "react-i18next";
import { LanguageList } from "../i18n";
import { AppSelect } from "./AppSelect";

export function LanguageChanger() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("languageKey", code);
  };

  const languageOptions = LanguageList.map((x) => ({
    label: x.name,
    value: x.lng,
  }));

  return (
    <AppSelect
      selected={i18n.language}
      onChange={handleChangeLanguage}
      options={languageOptions}
    />
  );
}
