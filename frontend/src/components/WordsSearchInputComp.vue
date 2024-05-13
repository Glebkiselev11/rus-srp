<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { InputAppearance } from "@/types/input";
import InputComp from "@/components/InputComp.vue";
import DropdownMenuComp, {
  type MenuItem,
} from "@/components/DropdownMenuComp.vue";
import { computed, ref, watch } from "vue";
import { useTranslations } from "@/common/useTranslations";

const { t } = useI18n();
const { getLanguageLabel } = useTranslations();
const props = defineProps<{
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
}>();

const showActions = ref(false);

const isLatin = computed(() => {
  return props.search.charCodeAt(0) < 500;
});

const actions = computed(
  () =>
    (isLatin.value
      ? [
          {
            handler: () => {
              console.log("add serbian latin word");
            },
            description: getLanguageLabel("srp_latin"),
          },
          {
            handler: () => {
              console.log("add english word");
            },
            description: getLanguageLabel("eng"),
          },
        ]
      : [
          {
            handler: () => {
              console.log("add serbian cyrillic word");
            },
            description: getLanguageLabel("srp_cyrillic"),
          },
          {
            handler: () => {
              console.log("add russian word");
            },
            description: getLanguageLabel("rus"),
          },
        ]
    ).map((x) => {
      return {
        ...x,
        icon: "add",
        label: t("create-word-from", { word: props.search }),
      };
    }) as MenuItem[]
);

watch(
  () => props.search,
  () => {
    showActions.value = props.search.length > 1;
  }
);

function update(newSearch: string) {
  emit("update:search", newSearch);
}

function closeActions() {
  showActions.value = false;
}
</script>

<template>
  <DropdownMenuComp
    :items="actions"
    :show-menu="showActions"
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
      />
    </template>
  </DropdownMenuComp>
</template>
