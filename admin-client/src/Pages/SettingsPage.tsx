import { useTranslation } from "react-i18next";
import { AppTopBar } from "../components/AppTopBar";
import { LanguageChanger } from "../components/LanguageChanger";
import { AppMain } from "../components/AppMain";
import { AppIcon } from "../components/AppIcon";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <AppTopBar title={t("settings")}></AppTopBar>
      <AppMain>
        <div className="mt-4 mx-auto w-[684px] py-3 px-6 bg-white rounded-2xl">
          <h6 className="text-xl">{t("general")}</h6>

          <div className="h-16 flex justify-between items-center">
            <div className="flex">
              <AppIcon name="translate" />
              <span className="ml-4">{t("interface-language")}</span>
            </div>
            <LanguageChanger />
          </div>
        </div>
      </AppMain>
    </>
  );
}
