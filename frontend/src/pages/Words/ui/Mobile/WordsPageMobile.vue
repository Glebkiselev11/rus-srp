<script lang="ts" setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { WordsSearchInputComp } from "@/widgets/WordForm";
import { WordCard } from "@/widgets/WordCard";
import { useWordsPageFilter } from "../../model/useWordsPageFilter";
import { useWordsQuery } from "@/entities/Word";

const { t } = useI18n();

const LIMIT_DEFAULT = 100;

const { filter, search, resetFiltersExcept, limit } = useWordsPageFilter({
  limitDefault: LIMIT_DEFAULT,
});

onMounted(() => {
  limit.value = LIMIT_DEFAULT;
});

const { data } = useWordsQuery(filter);
</script>

<template>
  <div class="words-page">
    <WordsSearchInputComp
      v-model:search="search"
      class="words-page__search"
      disable-actions
      :search-placeholder="t('search-in-all-words')"
      appearance="outline"
      width="100%"
      @reset-filter="resetFiltersExcept('search')"
    />

    <div class="words-page__words-wrap">
      <WordCard v-for="word in data?.words" :key="word.id" :word="word" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.words-page {
  $padding: 24px;
  position: relative;
  height: 100dvh;
  padding: $padding;
  background: $color-background;
  overflow: auto;

  &__search {
    position: sticky;
    z-index: 2;
    inset-block-start: 0;
  }

  &__words-wrap {
    padding-block-start: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
