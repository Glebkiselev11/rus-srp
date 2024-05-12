<script setup lang="ts">
import type { InputAppearance } from "@/types/input";
import InputComp from "@/components/InputComp.vue";

const props = defineProps<{
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
}>();

function update(newSearch: string) {
  emit("update:search", newSearch);
}
</script>

<template>
  <div class="words-search-input">
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
    />
  </div>
</template>

<style lang="scss" scoped></style>
