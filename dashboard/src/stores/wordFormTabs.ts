// Module to control word form tabs state
import i18n from "@/i18n";
import { defineStore } from "pinia";

export const useWordFormTabsStore = defineStore("wordFormTabs", {
	state: () => ({
		currentTabIndex: 0,
		tabs: [
			{
				name: i18n.global.t("translation"),
				error: false,
			},
			{
				name: i18n.global.t("categories"),
				error: false,
			},
		],
	}),

	getters: {
		isTranslationsTabOpen(state) {
			return state.currentTabIndex === 0;
		},
		isCategoriesTabOpen(state) {
			return state.currentTabIndex === 1;
		},
	},

	actions: {
		setTranslationsTabError(error: boolean) {
			this.tabs[0].error = error;
		},
		setCurrentTabIndex(index: number) {
			this.currentTabIndex = index;
		},
	},
});
