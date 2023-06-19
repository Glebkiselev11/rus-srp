export interface AppIconSVGProps {
  color: string;
  size: IconSize;
}

export type IconName =
  | "arrow_back"
  | "list"
  | "settings"
  | "add"
  | "menu"
  | "close"
  | "cancel"
  | "edit_note"
  | "translate";

export type IconSize = "20px" | "24px";
