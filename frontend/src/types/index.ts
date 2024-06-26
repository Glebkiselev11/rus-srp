import type { IconName } from "@/shared/ui/Icon";

export type NavItem = {
  label: string;
  name: string;
  icon: IconName;
  active: boolean;
};
