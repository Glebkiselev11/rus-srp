<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { WordsSearchInputComp } from "@/widgets/WordForm";
import { useWordsPageFilter } from "../../model/useWordsPageFilter";
import { useWordsQuery } from "@/entities/Word";
import { onMounted } from "vue";

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
      :search-placeholder="t('search-in-all-words')"
      appearance="outline"
      width="100%"
      @reset-filter="resetFiltersExcept('search')"
    />

    <div class="words-page__words-wrap">
      <div v-for="word in data?.words" :key="word.id">
        {{ word.rus }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.words-page {
  $padding: 24px;
  position: relative;
  height: 100dvh;
  padding: $padding;
  overflow: auto;

  &__search {
    position: sticky;
    inset-block-start: 0;
  }

  &__words-wrap {
    padding-block-start: 24px;
  }
}
</style>
