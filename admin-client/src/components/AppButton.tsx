import { useTranslation } from "react-i18next";
import { IconName } from "./AppIcon/types";
import { AppIcon } from "./AppIcon";
import { useMemo } from "react";

interface AppButtonProps {
  label?: string,
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
			return "text-black-600";	
		} else {
			return "text-white";
		}
	}, [disabled, type]);

	const iconColor = useMemo(() => {
		if (disabled) return "gray";
	
		if (type === "inline") {
			return "black";	
		} else {
			return "white";
		}
	}, [disabled, type]); 
	
	const buttonClasses = useMemo(() => {
		const inlineBgClasses = `bg-transparent ${!disabled && "hover:bg-indigo-100"}`;
		const filledBgClasses = `bg-indigo-600 ${disabled ? "bg-zinc-900/[.12]" : "hover:bg-indigo-600/[.92]"}`;

		return `
			${fontColor}
			${label ? "px-4 py-2" : "p-2"} rounded-full text-sm font-medium flex items-center 
			${type === "inline" ? inlineBgClasses : filledBgClasses} 
			${className}`;

	}, [type, disabled, className, fontColor, label]);

	const iconSize = label ? "20px" : "24px";
		
	return (
		<button 
			className={buttonClasses} 
			onClick={onClick}
			disabled={loading || disabled}
		>
			{icon && 
					<AppIcon 
						name={icon} 
						color={iconColor}
						size={iconSize}
					/>
			}
			
			{(icon && label) && <span className="w-[8px]"/> }

			{label && 
				<span>
					{loading ? t("wait") : label}
				</span>
			}
		</button>
	);
}