<script setup lang="ts">
import { computed } from "vue";
import type { Word } from "@/entities/Word";
import type { LanguageCode } from "@/shared/Translate";
import { VoiceoverComp } from "@/features/Voiceover";
import { highlighTextByQuery } from "@/common/utils";

type Translation = {
  label: string;
  sortable: boolean;
  sort_key: LanguageCode;
  width: string;
};

const props = defineProps<{
  word: Word;
  translation: Translation;
  search: string;
  hover: boolean;
}>();

const htmlText = computed(() =>
  highlighTextByQuery(props.word[props.translation.sort_key], props.search)
);

const languageCode = computed(() => {
  switch (props.translation.sort_key) {
    case "srp_cyrillic":
    case "srp_latin":
      return "sr";
    case "rus":
      return "ru";
    default:
      return "en";
  }
});
</script>

<template>
  <div class="translation-cell">
    <span class="text-overflow-ellipsis" v-html="htmlText" />

    <VoiceoverComp
      v-if="props.hover"
      :text="word[translation.sort_key]"
      :lang="languageCode"
    />
  </div>
</template>

<style scoped lang="scss">
.translation-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
