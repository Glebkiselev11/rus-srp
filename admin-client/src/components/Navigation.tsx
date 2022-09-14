import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageChanger } from "./LanguageChanger";

export function Navigation() {
	const { t } = useTranslation();
	return (
		<nav className="flex justify-between items-center px-5 h-[50px] bg-gray-300">
			<Link to="/" className="text-xl">{t("admin-panel")}</Link>

			<div className="flex">
				<LanguageChanger/>
			</div>
		</nav>
	);
}