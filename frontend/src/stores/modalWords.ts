import type { Id } from "@/shared/types";
import { defineStore } from "pinia";
import { CategoriesService } from "@/entities/Category";
import { computed, ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { KEY as WORDS_KEY } from "@/entities/Word";

export const useModalWordsStore = defineStore("modalWords", () => {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({ queryKey: [WORDS_KEY] });
    } catch (error) {
      console.error(error);
    }
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
