import { useTranslation } from "react-i18next";
import { SideMenuNavButton } from "./SideMenuNavButton";

export function SideMenu() {
	const { t } = useTranslation();

	return (
		<aside className="p-[12px] bg-white w-[265px] h-[100vh]">
			<nav className="flex flex-col">
				<SideMenuNavButton link="/" label={t("all-words")} />
				<SideMenuNavButton link="/settings" label={t("settings")} />

			</nav>
		</aside>
	);
}
