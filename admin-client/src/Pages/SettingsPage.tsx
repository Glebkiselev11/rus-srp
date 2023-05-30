import { useTranslation } from "react-i18next";
import AppHeader from "../components/AppHeader";
import { LanguageChanger } from "../components/LanguageChanger";

export default function SettingsPage() {
	const { t } = useTranslation();

	return (
		<>
			<AppHeader title={t("settings")}></AppHeader>

			<main>
				<div className="mt-10 mx-40">
					<LanguageChanger/>
				</div>
			</main>
		</>
	);
}
