<script lang="ts" setup>
import { ImageComp } from "@/shared/ui/Image";
import type { Word } from "@/entities/Word";
import { useTranslateHelpers } from "@/shared/Translate";

const props = defineProps<{
  word: Word;
}>();

const { getLanguageCodesOrder } = useTranslateHelpers();
</script>

<template>
  <div class="word-card">
    <ImageComp :src="word.image" size="96px" />

    <div class="word-card__translations">
      <span v-for="langCode in getLanguageCodesOrder()" :key="langCode">
        {{ props.word[langCode] }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.word-card {
  padding: 16px;
  border-radius: 8px;
  border: 1px solid $color-separator-primary;
  display: flex;
  column-gap: 12px;

  &__translations {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
}
</style>
