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
    <aside className="h-[100vh] w-[320px]">
      <div className="pl-8 flex items-center bg-white h-[56px]">
        <h6 className="text-xl font-normal">Srpski reć - admin</h6>
      </div>
      <nav className="mt-4 pl-3 pr-[22px] flex flex-col">
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
