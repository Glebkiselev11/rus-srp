import { ReactNode } from "react";
import { HEADER_SIZE } from "../consts";

interface AppMainProps {
  children?: ReactNode;
  headerPadding: boolean;
}

export function AppMain({ children, headerPadding }: AppMainProps) {
  return (
    <>
      <main
        style={{
          height: `calc(100vh - ${headerPadding ? HEADER_SIZE : "0"})`,
          marginBlockStart: headerPadding ? HEADER_SIZE : "0",
        }}
        className="w-full overflow-y-scroll"
      >
        {children}
      </main>
    </>
  );
}
