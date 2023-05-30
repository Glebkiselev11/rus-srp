import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface SideMenuNavButtonProps {
  link: string,
  label: string,
  className: string
}

export function SideMenuNavButton({ link, label, className }: SideMenuNavButtonProps) {
	const { pathname } = useLocation();
	const  enabledClass = pathname === link ? "bg-purple-200" : "" ;

	return (
		<Link to={link} className={`text-sm py-3.5 px-4 rounded-xl hover:bg-purple-300 ${enabledClass} ${className}`}>
			{label}
		</Link>
	);
}
