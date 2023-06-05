import { ReactNode } from "react";
import { HEADER_SIZE } from "../consts";

interface AppHeaderProps {
  children?: ReactNode,
  title: string,
}

export function AppHeader({ children, title }: AppHeaderProps) {
	return (
		<header 
			style={{ height: HEADER_SIZE }} 
			className="bg-white px-6 flex items-center justify-between"
		>
			<h1 className="text-2xl">{title}</h1>

			<div>
				{children}
			</div>
		</header>
	);
}