import { useTranslation } from "react-i18next";
import { SideMenuNavButton } from "./SideMenuNavButton";
import { useMemo } from "react";
import { IconName } from "./AppIcon/types";
import { AppButton } from "./AppButton";
import { useDispatch, useSelector } from "react-redux";
import { selectIsOpen, toggle } from "../store/sideMenu";

interface NavigationItem {
	link: string,
	label: string,
	className: string,
	icon: IconName
}

export function SideMenu() {
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const isSideMenuOpen = useSelector(selectIsOpen);

	const navigation: NavigationItem[] = useMemo(() => [
		{ link: "/", label: t("all-words"), className: "mb-1", icon: "list" },
		{ link: "/settings", label: t("settings"), className: "mb-1", icon: "settings" }
	], [t]);

	function handleToggleMenu() {
		dispatch(toggle());
	}

	const asideClass = `
		px-[12px] bg-white h-[100vh]
		${isSideMenuOpen ? "w-[320px]" : "w-[80px]"}
		`;

	return (
		<aside className={asideClass}>
			<div className="pl-2 flex items-center mb-[40px] h-[56px]">
				<AppButton icon="menu" className="mr-1" onClick={handleToggleMenu}/>

				{isSideMenuOpen && 
					<h6 className="text-xl font-normal">Srpski reć - admin</h6>
				}
			</div>
			<nav className="flex flex-col">
				{navigation.map(({ link, label, className, icon }) => 
					<SideMenuNavButton 
						key={link} 
						link={link} 
						label={label} 
						className={className} 
						icon={icon} 
						isOpen={isSideMenuOpen}
					/>
				)}
			</nav>
		</aside>
	);
}
