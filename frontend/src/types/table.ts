import type { SortKey } from "./api";
import type { IconColor, IconName } from "./icons";

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
