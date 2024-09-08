/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowMount, VueWrapper } from "@vue/test-utils";
import { expect, test, describe } from "vitest";
import PaginationBarWidget from "./PaginationBarWidget.vue";
import { i18n } from "@/shared/i18n";

describe("PaginationBarWidget", () => {
  test("should calculate correct vulues according to props", () => {
    const wrapper = shallowMount(PaginationBarWidget, {
      props: {
        count: 100,
        offset: 25,
        limit: 25,
        limitOptions: [{ value: 25, label: "25" }],
      },
      global: {
        plugins: [i18n],
      },
    }) as VueWrapper<any>;

    expect(wrapper.vm.currentPage).toBe(2);
    expect(wrapper.vm.lastPage).toBe(4);
    expect(wrapper.vm.currentRange).toBe("26-50");
  });

  test("Shouldn't show pagination controls if there is only one page", () => {
    const wrapper = shallowMount(PaginationBarWidget, {
      props: {
        count: 24,
        offset: 0,
        limit: 25,
        limitOptions: [{ value: 25, label: "25" }],
      },
      global: {
        plugins: [i18n],
      },
    }) as VueWrapper<any>;

    expect(wrapper.vm.showPaginationControls).toBe(false);
  });
});
