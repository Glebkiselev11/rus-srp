import { ReactNode } from "react";

interface AppHeaderProps {
  children?: ReactNode,
  title: string,
}

export function AppHeader({ children, title }: AppHeaderProps) {
	return (
		<header className="bg-white py-2 px-6 flex items-center justify-between">
			<h1 className="text-2xl">{title}</h1>

			<div>
				{children}
			</div>
		</header>
	);
}