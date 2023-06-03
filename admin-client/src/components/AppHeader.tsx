import { ReactNode } from "react";

interface AppHeaderProps {
  children?: ReactNode,
  title: string,
}

export function AppHeader({ children, title }: AppHeaderProps) {
	return (
		<header className="bg-white px-6 h-[56px] flex items-center justify-between">
			<h1 className="text-2xl">{title}</h1>

			<div>
				{children}
			</div>
		</header>
	);
}