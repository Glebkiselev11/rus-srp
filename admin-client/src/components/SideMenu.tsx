import { useTranslation } from "react-i18next";
import { SideMenuNavButton } from "./SideMenuNavButton";
import { useMemo } from "react";
import { IconName } from "./AppIcon/types";
interface NavigationItem {
  link: string;
  label: string;
  className: string;
  icon: IconName;
}

export function SideMenu() {
  const { t } = useTranslation();

  const navigation: NavigationItem[] = useMemo(
    () => [
      { link: "/", label: t("all-words"), className: "mb-1", icon: "list" },
      {
        link: "/settings",
        label: t("settings"),
        className: "mb-1",
        icon: "settings",
      },
    ],
    [t]
  );

  return (
    <aside>
      <nav className="mt-[72px] w-[256px] px-3 flex flex-col">
        {navigation.map(({ link, label, className, icon }) => (
          <SideMenuNavButton
            key={link}
            link={link}
            label={label}
            className={className}
            icon={icon}
          />
        ))}
      </nav>
    </aside>
  );
}
