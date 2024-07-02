<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { InputComp, type InputAppearance } from "@/shared/ui/Input";
import WordFormModalComp from "@/components/WordForm/WordFormModalComp.vue";
import { DropdownMenuComp, type MenuItem } from "@/shared/ui/DropdownMenu";
import {
  useTranslateHelpers,
  getLanguageCodesAccordingText,
  type LanguageCode,
} from "@/shared/Translate";
import { useDraftWordStore } from "@/stores/draftWord";
import type { Id } from "@/shared/types";

const { t } = useI18n();
const draftWordStore = useDraftWordStore();
const { getLanguageLabel, getLanguageCodesOrder } = useTranslateHelpers();
const props = defineProps<{
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
  categoryId?: Id;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
}>();

const showWordForm = ref(false);
const showActions = ref(false);

const actions = computed(
  () =>
    getLanguageCodesOrder()
      .filter((code) =>
        getLanguageCodesAccordingText(props.search).includes(code)
      )
      .map((code) => {
        return {
          icon: "add",
          label: t("create-word-from", { word: props.search }),
          description: getLanguageLabel(code),
          handler: () => startCreatingWord(code, props.search),
        };
      }) as MenuItem[]
);

const computedShowActions = computed(() => {
  return showActions.value && actions.value.length > 0;
});

function update(newSearch: string) {
  emit("update:search", newSearch);
}

async function startCreatingWord(code: LanguageCode, word: string) {
  draftWordStore.initDraftWord(undefined);
  await nextTick(() => {
    draftWordStore.draftWord[code] = word;

    if (props.categoryId) {
      draftWordStore.draftWord.category_ids.push(props.categoryId);
    }

    showWordForm.value = true;
  });

  draftWordStore.autoFillTranslations();
}

function closeActions() {
  showActions.value = false;
}
</script>

<template>
  <div
    :style="{
      width: props.width,
    }"
  >
    <DropdownMenuComp
      :items="actions"
      :show-menu="computedShowActions"
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
          @focus="showActions = true"
        />
      </template>
    </DropdownMenuComp>

    <WordFormModalComp v-if="showWordForm" @close="showWordForm = false" />
  </div>
</template>
