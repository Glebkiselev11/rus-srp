<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { InputComp, type InputAppearance } from "@/shared/ui/Input";
import { DropdownMenuComp, type MenuItem } from "@/shared/ui/DropdownMenu";
import { ListItemComp } from "@/shared/ui/ListItem";
import HiddenWordsCountComp from "./HiddenWordsCountComp.vue";
import {
  useTranslateHelpers,
  getLanguageCodesAccordingText,
  type LanguageCode,
} from "@/shared/Translate";
import { useDraftWordStore } from "../model/draftWord";
import WordFormModalWidget from "./WordFormModalWidget.vue";

import type { Id } from "@/shared/types";

const { t } = useI18n();
const draftWordStore = useDraftWordStore();
const { getLanguageLabel, getLanguageCodesOrder } = useTranslateHelpers();

type Props = {
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
  categoryId?: Id;
  wordsCountWithFilters?: number; // It is found with filter (category, search, confirmed, etc.)
  hiddenWordsCount?: number; // It is found with filter search
  disableActions?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "reset-filter"): void;
}>();

const showWordForm = ref(false);
const showActions = ref(false);

const actions = computed(
  () =>
    getLanguageCodesOrder()
      .filter(() => !props.disableActions)
      .filter(() => {
        if (
          props.wordsCountWithFilters === undefined &&
          props.hiddenWordsCount === undefined
        ) {
          return true;
        }

        return (
          !showHiddenWordsCount.value && // don't show actions if there are hidden words
          props.wordsCountWithFilters !== undefined // don't show actions if there are no loaded count of words
        );
      })
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

const showHiddenWordsCount = computed(() => {
  return Boolean(
    showActions.value &&
      props.hiddenWordsCount &&
      props.hiddenWordsCount > 0 &&
      props.search.length > 0
  );
});

const computedShowActions = computed(() => {
  return (
    (showActions.value && actions.value.length > 0) ||
    showHiddenWordsCount.value
  );
});

const commonWordsCount = computed(() => {
  return (props.wordsCountWithFilters ?? 0) + (props.hiddenWordsCount ?? 0);
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

function resetFilter() {
  showActions.value = false;
  emit("reset-filter");
}

function handleFocus() {
  showActions.value = true;
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
      :max-width="props.width"
      @close="closeActions"
    >
      <template v-if="showHiddenWordsCount" #menu>
        <ListItemComp clickable @click="resetFilter">
          <HiddenWordsCountComp :count="commonWordsCount" />
        </ListItemComp>
      </template>

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
          @focus="handleFocus"
        />
      </template>
    </DropdownMenuComp>

    <WordFormModalWidget v-if="showWordForm" @close="showWordForm = false" />
  </div>
</template>
