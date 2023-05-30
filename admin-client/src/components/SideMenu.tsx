import { useTranslation } from "react-i18next";
import { SideMenuNavButton } from "./SideMenuNavButton";
import { useMemo } from "react";

export function SideMenu() {
	const { t } = useTranslation();

	const navigation = useMemo(() => [
		{ link: "/", label: t("all-words"), className: "mb-1" },
		{ link: "/settings", label: t("settings"), className: "mb-1" }
	], [t]);

	return (
		<aside className="p-[12px] bg-white w-[265px] h-[100vh]">
			<nav className="flex flex-col">
				{navigation.map(({ link, label, className }) => 
					<SideMenuNavButton key={link} link={link} label={label} className={className}/>
				)}
			</nav>
		</aside>
	);
}
