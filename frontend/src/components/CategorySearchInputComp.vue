<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { getLanguageCodesAccordingText } from "@/common/translations";
import type { InputAppearance } from "@/types/input";
import InputComp from "@/components/InputComp.vue";
import DropdownMenuComp, {
  type MenuItem,
} from "@/components/DropdownMenuComp.vue";
import { computed, ref } from "vue";

const { t, locale } = useI18n();

const props = defineProps<{
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
}>();

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
  console.log("startCategoryCreation");
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
  </div>
</template>
