interface AppButtonProps {
  label: string,
  onClick: () => void,
  className?: string,
}

export function AppButton({ label, onClick, className }: AppButtonProps) {
	const buttonClasses = [
		"bg-blue-400 text-white px-4 py-2 hover:shadow-lg uppercase",
		className
	].join(" ");

	return (
		<button 
			className={buttonClasses} 
			onClick={() => onClick()}
		>
			{label}
		</button>
	);
}