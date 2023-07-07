import { ReactNode } from "react";
import { HEADER_SIZE } from "../consts";
import { AppIcon } from "./AppIcon";

interface AppTopBarProps {
  children?: ReactNode;
  title: string;
}

export function AppTopBar({ children, title }: AppTopBarProps) {
  return (
    <>
      <div style={{ height: HEADER_SIZE }} />
      <header
        style={{ height: HEADER_SIZE }}
        className="fixed top-0 left-0 right-0 bg-white px-6 flex items-center justify-between"
      >
        <div className="flex items-center">
          <div className="ml-2 w-[256px]">
            <h6 className="text-xl font-normal">Srpski reć</h6>
            <div className="flex items-center">
              <AppIcon size="18px" name="admin_panel_settings" />
              <span className="ml-2 text-sm text-gray-700">Admin</span>
            </div>
          </div>
          <h1 className="text-2xl">{title}</h1>
        </div>

        <div>{children}</div>
      </header>
    </>
  );
}
