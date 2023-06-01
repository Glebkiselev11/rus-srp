import { ArrowBackIcon } from "./ArrowBackIcon";
import { ListIcon } from "./ListIcon";
import { IconName } from "./types";
import { SettingsIcon } from "./SettingsIcon";

interface AppIconProps {
  color?: string,
  name: IconName
}

export function AppIcon({ color = "black", name }: AppIconProps) {
	const Icon = {
		"arrow_back": ArrowBackIcon,
		"list": ListIcon,
		"settings": SettingsIcon
	}[name];

	return (
		<Icon color={color}/>
	);
}