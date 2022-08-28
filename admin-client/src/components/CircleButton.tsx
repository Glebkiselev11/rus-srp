interface CircleButtonProps {
  icon: string,
  onClick: () => void
}

export function CircleButton({ icon, onClick }: CircleButtonProps) {
	return (
		<button 
			className="bg-red-500 w-[50px] h-[50px] rounded-full text-white text-2xl" 
			onClick={() => onClick()}
		> 
			{icon}
		</button>
	);
}