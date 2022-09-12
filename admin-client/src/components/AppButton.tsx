import { useTranslation } from "react-i18next";

interface AppButtonProps {
  label: string,
  onClick: () => void,
  className?: string,
	loading?: boolean,
	disabled?: boolean,
}

export function AppButton({ label, onClick, className, loading, disabled }: AppButtonProps) {
	const { t } = useTranslation();
	
	const buttonClasses = [
		"bg-blue-400 text-white px-4 py-2 uppercase",
		className,
		disabled ? "bg-gray-200" : "hover:shadow-lg"
	].join(" ");

	return (
		<button 
			className={buttonClasses} 
			onClick={() => onClick()}
			disabled={loading || disabled}
		>
			{loading ? t("wait") : label}
		</button>
	);
}