import type { IconColor, IconName } from "./icons";

export type TableColumn = {
	sort_key?: string;
	sortable: boolean;
	width?: string;
	label?: string;
	icon?: {
		name: IconName;
		color: IconColor;
	};
}
