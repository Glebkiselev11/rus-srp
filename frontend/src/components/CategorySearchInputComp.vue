<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  getLanguageCodesAccordingText,
  type LanguageCode,
} from "@/shared/Translate";
import type { Id } from "@/shared/types";
import { InputComp, type InputAppearance } from "@/shared/ui/Input";
import { DropdownMenuComp, type MenuItem } from "@/shared/ui/DropdownMenu";

import { computed, ref } from "vue";
import CategoryFormModalComp from "@/components/CategoryForm/CategoryFormModalComp.vue";
import { useDraftCategoryStore } from "@/stores/draftCategory";

const { t, locale } = useI18n();
const draftCategoryStore = useDraftCategoryStore();

const props = defineProps<{
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "created-category", categoryId: Id): void;
}>();

const showCategoryForm = ref(false);
const showSuggestion = ref(false);
const action = computed(
  () =>
    ({
      icon: "add",
      label: t("create-category-from", { category: props.search }),
      handler: () => startCategoryCreation(),
    }) as MenuItem
);

const computedShowSuggestion = computed(() => {
  return (
    showSuggestion.value &&
    getLanguageCodesAccordingText(props.search).some(
      (code) => code === locale.value
    )
  );
});

function update(newSearch: string) {
  emit("update:search", newSearch);
}
function closeActions() {
  showSuggestion.value = false;
}

function startCategoryCreation() {
  showCategoryForm.value = true;
  draftCategoryStore.initDraftCategory();
  draftCategoryStore.draftCategory[locale.value as LanguageCode] = props.search;
}

function createdCategory(categoryId: Id) {
  emit("created-category", categoryId);
}
</script>

<template>
  <div
    :style="{
      width: props.width,
    }"
  >
    <DropdownMenuComp
      :items="[action]"
      :show-menu="computedShowSuggestion"
      position="right"
      @close="closeActions"
    >
      <template #anchor>
        <InputComp
          :model-value="props.search"
          :appearance="props.appearance"
          type="text"
          :placeholder="props.searchPlaceholder"
          left-icon="search"
          debounce
          :width="props.width"
          clear-button
          @update:model-value="update"
          @focus="showSuggestion = true"
        />
      </template>
    </DropdownMenuComp>

    <CategoryFormModalComp
      v-if="showCategoryForm"
      @close="showCategoryForm = false"
      @created="createdCategory"
    />
  </div>
</template>
