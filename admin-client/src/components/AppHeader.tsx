import { ReactNode } from "react";

interface AppHeaderProps {
  children?: ReactNode,
  title: string,
}

export function AppHeader({ children, title }: AppHeaderProps) {
	return (
		<header className="bg-white py-4 px-6">
			<h1 className="text-2xl bg-neutral-950">{title}</h1>

			<div>
				{children}
			</div>
		</header>
	);
}