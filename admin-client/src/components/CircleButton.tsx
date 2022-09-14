interface CircleButtonProps {
  icon: string,
  onClick: () => void
}

export function CircleButton({ icon, onClick }: CircleButtonProps) {
	return (
		<button 
			className="bg-red-500 w-[50px] h-[50px] rounded-full  hover:shadow-xl" 
			onClick={() => onClick()}
		> 
			<div className="text-white text-4xl  pt-1 h-full">{icon}</div>
		</button>
	);
}