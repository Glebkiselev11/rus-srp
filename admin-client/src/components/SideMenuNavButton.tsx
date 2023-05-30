import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface SideMenuNavButtonProps {
  link: string,
  label: string,
  className?: string
}

export function SideMenuNavButton({ link, label, className = "" }: SideMenuNavButtonProps) {
	const { pathname } = useLocation();
	const  isActive = pathname === link;
	const enabledClass = isActive ? "bg-purple-200" : "" ;

	const combineClasses = (...classes: string[]): string => {
		return classes.filter(Boolean).join(" ");
	};

	return (
		<Link 
			to={link} 
			className={combineClasses("text-sm py-3.5 px-4 rounded-xl hover:bg-purple-300", enabledClass, className)}
			aria-current={isActive ? "page" : undefined}
		>
			{label}
		</Link>
	);
}
