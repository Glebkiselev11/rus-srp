import { ArrowBackIcon } from "./ArrowBackIcon";
import { ListIcon } from "./ListIcon";
import { IconName, IconSize } from "./types";
import { SettingsIcon } from "./SettingsIcon";
import { AddIcon } from "./AddIcon";
import { MenuIcon } from "./MenuIcon";
import { CloseIcon } from "./CloseIcon";
import { CancelIcon } from "./CancelIcon";
import { EditNoteIcon } from "./EditNoteIcon";

interface AppIconProps {
  color?: "black" | "white" | "gray" | "indigo", 
	size?: IconSize,
  name: IconName
}

export function AppIcon({ color = "black", name, size = "24px" }: AppIconProps) {
	const _color = {
		"black": "fill-black",
		"white": "fill-white",
		"gray": "fill-gray-400",
		"indigo": "fill-indigo-600"
	}[color]; 

	const Icon = {
		"arrow_back": ArrowBackIcon,
		"list": ListIcon,
		"settings": SettingsIcon,
		"add": AddIcon,
		"menu": MenuIcon,
		"close": CloseIcon,
		"cancel": CancelIcon,
		"edit_note": EditNoteIcon
	}[name];

	return (
		<Icon color={_color} size={size}/>
	);
}