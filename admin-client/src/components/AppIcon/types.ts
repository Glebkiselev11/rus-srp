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
  | "translate"
  | "admin_panel_settings";

export type IconSize = "18px" | "20px" | "24px";
