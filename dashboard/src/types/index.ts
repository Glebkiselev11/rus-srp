import type { IconName } from "./icons";

export interface NavItem {
	label: string;
	name: string;
	icon: IconName;
	active: boolean;
}

