import { Link } from "react-router-dom";
import { AppIcon } from "./AppIcon";
import { useLocation } from "react-router-dom";
import { IconName } from "./AppIcon/types";

interface SideMenuNavButtonProps {
  link: string;
  label: string;
  className?: string;
  icon: IconName;
}

export function SideMenuNavButton({
  link,
  label,
  className = "",
  icon,
}: SideMenuNavButtonProps) {
  const { pathname } = useLocation();
  const isActive = pathname === link;
  const enabledClass = isActive ? "bg-purple-200" : "";

  const combineClasses = (...classes: string[]): string => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <Link
      to={link}
      className={combineClasses(
        "text-sm py-3.5 px-4 rounded-xl hover:bg-purple-300 flex items-center",
        enabledClass,
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <AppIcon name={icon} />
      <span className="ml-3">{label}</span>
    </Link>
  );
}
