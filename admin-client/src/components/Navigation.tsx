import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageChanger } from "./LanguageChanger";

export function Navigation() {
	const { t } = useTranslation();
	return (
		<nav className="flex justify-between items-center px-5 h-[50px] bg-gray-300">
			<span className="text-xl">{t("admin-panel")}</span>

			<div className="flex">
				<Link to="/" className="uppercase hover:underline mr-6">{t("main")}</Link>
				<LanguageChanger/>
			</div>
		</nav>
	);
}