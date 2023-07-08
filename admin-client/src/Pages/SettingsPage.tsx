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
          <h6 className="text-xl mb-6">{t("general")}</h6>

          <div className="h-16 flex items-center">
            <AppIcon name="translate" />
            <div className="ml-4">
              <label className="block" htmlFor="language_changer">
                {t("interface-language")}
              </label>
              <LanguageChanger id="language_changer" />
            </div>
          </div>
        </div>
      </AppMain>
    </>
  );
}
