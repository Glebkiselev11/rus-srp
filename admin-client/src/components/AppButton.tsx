import { useTranslation } from "react-i18next";
import { IconName } from "./AppIcon/types";
import { AppIcon } from "./AppIcon";

interface AppButtonProps {
  label: string,
  onClick: () => void,
  className?: string,
	loading?: boolean,
	disabled?: boolean,
	icon?: IconName,
	type: "filled" | "inline"
}

export function AppButton({ label, onClick, className, loading, disabled, icon, type = "inline" }: AppButtonProps) {
	const { t } = useTranslation();

	const inlineClasses = [
		"text-indigo-600 bg-transparent",
		disabled ? "text-neutral-900/[.38]" : "hover:bg-indigo-100",
	];

	const filledClasses = [
		"bg-indigo-600 text-white",
		disabled ? "bg-zinc-900/[.12] text-neutral-900/[.38]" : "hover:bg-indigo-600/[.92]",
	];
	
	const buttonClasses = [
		"px-4 py-2 rounded-full text-sm font-medium",
		type === "inline" ? inlineClasses : filledClasses,
		className,
	].flat().join(" ");

	return (
		<button 
			className={buttonClasses} 
			onClick={() => onClick()}
			disabled={loading || disabled}
		>
			{icon && <AppIcon name={icon}/>}
			{loading ? t("wait") : label}
		</button>
	);
}