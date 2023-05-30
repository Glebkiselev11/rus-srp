import { Link } from "react-router-dom";

interface SideMenuNavButtonProps {
  link: string,
  label: string
}

export function SideMenuNavButton({ link, label }: SideMenuNavButtonProps) {
	return (
		<Link to={link} className="text-sm py-3.5 px-4 rounded-xl hover:bg-purple-300">
			{label}
		</Link>
	);
}
