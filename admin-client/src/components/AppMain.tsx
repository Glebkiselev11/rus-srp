import { ReactNode } from "react";

interface AppMainProps {
  children?: ReactNode,
}

const HEADER_SIZE = "64px";

export function AppMain ({ children }: AppMainProps) {
	return (
		<main className="w-full overflow-y-scroll" style={{ height: `calc(100vh - ${HEADER_SIZE})` }}>
			{children}
		</main>
	);
}