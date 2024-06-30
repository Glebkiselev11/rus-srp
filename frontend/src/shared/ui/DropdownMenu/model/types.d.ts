import type { IconName, IconColor } from "@/shared/ui/Icon";

export type MenuItem = {
  label: string;
  labelColor?: IconColor;
  description?: string;
  icon?: IconName;
  color?: IconColor;
  iconColor?: IconColor;
  handler: () => void;
};

export type Position = "left" | "right";
