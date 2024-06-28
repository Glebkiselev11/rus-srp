import type { SortKey } from "./api";
import type { IconColor, IconName } from "@/shared/ui/Icon";

export type TableColumn = {
  sort_key?: SortKey;
  sortable: boolean;
  width?: string;
  label?: string;
  icon?: {
    name: IconName;
    color: IconColor;
  };
};
