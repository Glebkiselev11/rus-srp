import { useTranslation } from "react-i18next";
import { IconName } from "./AppIcon/types";
import { AppIcon } from "./AppIcon";
import { useMemo } from "react";

interface AppButtonProps {
  label: string,
  onClick: () => void,
  className?: string,
	loading?: boolean,
	disabled?: boolean,
	icon?: IconName,
	type?: ButtonType
}

type ButtonType = "filled" | "inline";

export function AppButton({ 
	label, 
	onClick, 
	loading, 
	icon, 
	className = "",
	disabled = false, 
	type = "inline" 
}: AppButtonProps) {
	const { t } = useTranslation();

	const fontColor = useMemo(() => {
		if (disabled) return "text-gray-400";
	
		if (type === "inline") {
			return "text-indigo-600";	
		} else {
			return "text-white";
		}
	}, [disabled, type]);

	const iconColor = useMemo(() => {
		if (disabled) return "gray";
	
		if (type === "inline") {
			return "indigo";	
		} else {
			return "white";
		}
	}, [disabled, type]); 
	
	const buttonClasses = useMemo(() => {
		const inlineBgClasses = `bg-transparent ${!disabled && "hover:bg-indigo-100"}`;
		const filledBgClasses = `bg-indigo-600 ${disabled ? "bg-zinc-900/[.12]" : "hover:bg-indigo-600/[.92]"}`;

		return `
			${fontColor}
			px-4 py-2 rounded-full text-sm font-medium flex items-center 
			${type === "inline" ? inlineBgClasses : filledBgClasses} 
			${className}`;

	}, [type, disabled, className, fontColor]);
		
	return (
		<button 
			className={buttonClasses} 
			onClick={onClick}
			disabled={loading || disabled}
		>
			{icon && 
				<div className="mr-2">
					<AppIcon 
						name={icon} 
						color={iconColor}
						size="20px"
					/>
				</div>
			}
			{loading ? t("wait") : label}
		</button>
	);
}