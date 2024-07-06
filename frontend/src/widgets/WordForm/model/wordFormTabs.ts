// Module to control word form tabs state
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

export const useWordFormTabsStore = defineStore("wordFormTabs", () => {
  const { t } = useI18n();

  const currentTabIndex = ref(0);
  const tabs = ref([
    {
      name: t("translation"),
      error: false,
    },
    {
      name: t("categories"),
      error: false,
    },
  ]);

  const isTranslationsTabOpen = computed(() => {
    return currentTabIndex.value === 0;
  });

  const isCategoriesTabOpen = computed(() => {
    return currentTabIndex.value === 1;
  });

  const setTranslationsTabError = (error: boolean) => {
    tabs.value[0].error = error;
  };

  const setCurrentTabToCategories = () => {
    currentTabIndex.value = 1;
  };

  const resetCurrentTab = () => {
    currentTabIndex.value = 0;
  };

  const setCurrentTabIndex = (index: number) => {
    currentTabIndex.value = index;
  };

  return {
    currentTabIndex,
    tabs,
    isTranslationsTabOpen,
    isCategoriesTabOpen,
    setTranslationsTabError,
    setCurrentTabToCategories,
    resetCurrentTab,
    setCurrentTabIndex,
  };
});
