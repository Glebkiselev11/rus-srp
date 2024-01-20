import type { IconName } from "./icons";

export type NavItem = {
	label: string;
	name: string;
	icon: IconName;
	active: boolean;
}

export type Checkbox = {
	checked: boolean;
	indeterminated: boolean;
	disabled: boolean;
} 

