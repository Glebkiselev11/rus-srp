import { ReactNode } from "react";
import { HEADER_SIZE } from "../consts";

interface AppMainProps {
  children?: ReactNode,
}

export function AppMain ({ children }: AppMainProps) {
	return (
		<main 
			style={{ height: `calc(100vh - ${HEADER_SIZE})` }}
			className="w-full overflow-y-scroll" 
		>
			{children}
		</main>
	);
}