<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { InputAppearance } from "@/types/input";
import InputComp from "@/components/InputComp.vue";
import WordFormModalComp from "@/components/WordForm/WordFormModalComp.vue";
import DropdownMenuComp, {
  type MenuItem,
} from "@/components/DropdownMenuComp.vue";
import { computed, nextTick, ref, watch } from "vue";
import { useTranslations } from "@/common/useTranslations";
import { getLanguageCodesAccordingText } from "@/common/translations";
import type { LanguageCode } from "@/types/translations";
import { useDraftWordStore } from "@/stores/draftWord";

const { t } = useI18n();
const draftWordStore = useDraftWordStore();
const { getLanguageLabel, getLanguageCodesOrder } = useTranslations();
const props = defineProps<{
  search: string;
  appearance: InputAppearance;
  width: string;
  searchPlaceholder: string;
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

watch(
  () => props.search,
  () => {
    showActions.value = props.search.length > 1;
  }
);

function update(newSearch: string) {
  emit("update:search", newSearch);
}

async function startCreatingWord(code: LanguageCode, word: string) {
  draftWordStore.initDraftWord(undefined);
  await nextTick(() => {
    draftWordStore.draftWord[code] = word;
    showWordForm.value = true;
  });

  draftWordStore.autoFillTranslations();
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

  <WordFormModalComp v-if="showWordForm" @close="showWordForm = false" />
</template>
