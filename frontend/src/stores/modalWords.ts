import type { Id } from "@/types/api";
import { defineStore } from "pinia";
import { CategoriesService } from "@/api";
import { computed, ref } from "vue";

export const useModalWordsStore = defineStore("modalWords", () => {
  const selectedWordIds = ref([] as Array<Id>);

  const isAnyWordSelected = computed(() => {
    return selectedWordIds.value.length > 0;
  });

  const updateSelectedWordIds = (id: Id, select: boolean) => {
    if (select) {
      selectedWordIds.value.push(id);
    } else {
      selectedWordIds.value = selectedWordIds.value.filter((i) => i !== id);
    }
  };

  const addSelectedWordsToCategory = async (categoryId: Id) => {
    try {
      await CategoriesService.addWords(categoryId, selectedWordIds.value);
    } catch (error) {
      console.error(error);
    }

    $reset();
  };

  const $reset = () => {
    selectedWordIds.value = [];
  };

  return {
    selectedWordIds,
    isAnyWordSelected,
    $reset,
    updateSelectedWordIds,
    addSelectedWordsToCategory,
  };
});
