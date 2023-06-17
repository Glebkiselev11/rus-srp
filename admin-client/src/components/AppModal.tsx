import { ReactNode } from "react";
import { AppButton } from "./AppButton";

interface AppModalProps {
  children: ReactNode;
  title: string;
  description?: string;
  closeHandler: () => void;
}

export function AppModal({
  children,
  title,
  description,
  closeHandler,
}: AppModalProps) {
  return (
    <div className="fixed left-0 top-0 right-0 bottom-0 bg-black/25 flex items-center justify-center">
      <div className="bg-white min-w-[566px] min-h-[300px] rounded-2xl p-4">
        <header className="flex items-start justify-between">
          <div>
            <h6 className="text-xl">{title}</h6>
            <span className="text-sm text-black/60">{description}</span>
          </div>

          <AppButton icon="close" onClick={closeHandler} />
        </header>
        {children}
      </div>
    </div>
  );
}
