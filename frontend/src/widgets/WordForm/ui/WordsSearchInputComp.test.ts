/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount, VueWrapper } from "@vue/test-utils";
import WordsSearchInputComp from "./WordsSearchInputComp.vue";
import { expect, test, vi, describe } from "vitest";
import { createPinia } from "pinia";
import { i18n } from "@/shared/i18n";

describe("WordsSearchInputComp", () => {
  const pinia = createPinia();

  vi.mock("@/shared/Translate", () => ({
    useTranslateHelpers: () => ({
      getLanguageLabel: vi.fn().mockReturnValue("English"),
      getLanguageCodesOrder: vi
        .fn()
        .mockReturnValue(["eng", "srp_latin", "srp_cyrillic", "rus"]),
    }),

    getLanguageCodesAccordingText: vi.fn().mockReturnValue(["eng"]),
  }));

  test("should show suggestion on english input", async () => {
    const wrapper = shallowMount(WordsSearchInputComp, {
      props: {
        search: "",
        appearance: "default",
        width: "100%",
        searchPlaceholder: "Search",
      },
      global: {
        plugins: [i18n, pinia],
      },
    }) as VueWrapper<any>;

    expect(wrapper.vm.computedShowActions).toBe(false);

    wrapper.vm.showActions = true;
    await wrapper.setProps({ search: "some search term" });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedShowActions).toBe(true);
    expect(wrapper.vm.actions.length).toBe(1);
  });

  test("should show hidden words count instead suggestion when hiddenWordsCount > 0", async () => {
    const wrapper = shallowMount(WordsSearchInputComp, {
      props: {
        search: "",
        appearance: "default",
        width: "100%",
        searchPlaceholder: "Search",
        hiddenWordsCount: 2,
        wordsCountWithFilters: 1,
      },
      global: {
        plugins: [i18n, pinia],
      },
    }) as VueWrapper<any>;

    expect(wrapper.vm.computedShowActions).toBe(false);

    wrapper.vm.showActions = true;

    await wrapper.setProps({ search: "some search term" });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.computedShowActions).toBe(true);
    expect(wrapper.vm.actions.length).toBe(0);
    expect(wrapper.vm.showHiddenWordsCount).toBe(true);
  });
});
