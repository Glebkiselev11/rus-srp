<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
  Id,
  OptionalRequestParams,
  Order,
  TranslationApprovedStatus,
} from "@/shared/types";
import { WordsSearchInputComp } from "@/widgets/WordForm";
import { SelectComp } from "@/shared/ui/Select";
import { SwitchComp } from "@/shared/ui/Switch";
import { IconComp } from "@/shared/ui/Icon";
import { useWordsCountQuery } from "@/entities/Word";

type Props = {
  search: string;
  order: Order;
  translationApprovedStatus: TranslationApprovedStatus;
  wordsCountWithFilter?: number; // It is found with filter (category, search, confirmed, etc.)
  categoryId?: Id;
};

const { t } = useI18n();

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "update:order", value: Order): void;
  (
    e: "update:translationApprovedStatus",
    value: TranslationApprovedStatus
  ): void;
  (e: "reset-filters-except-search"): void;
}>();

const searchFilter = computed((): OptionalRequestParams => {
  return { search: props.search };
});

// This is common number of words count for filtered only by search
const { data: wordsCountFilteredBySearch } = useWordsCountQuery(searchFilter);

const hiddenWordsCount = computed(() => {
  if (
    wordsCountFilteredBySearch.value === undefined ||
    props.wordsCountWithFilter === undefined
  ) {
    return 0;
  }

  return wordsCountFilteredBySearch.value - (props.wordsCountWithFilter ?? 0);
});

const orderOptions = computed(() => [
  { value: "-created_at" as Order, label: t("order.last-added") },
  { value: "-updated_at" as Order, label: t("order.last-updated") },
]);

const switcherValue = computed<boolean>({
  get() {
    return props.translationApprovedStatus === "exclude_approved";
  },
  set(newValue: boolean) {
    emit(
      "update:translationApprovedStatus",
      newValue ? "exclude_approved" : "all"
    );
  },
});

const searchPlaceholder = computed<string>(() => {
  return props.categoryId
    ? t("search-in-category-words")
    : t("search-in-all-words");
});

function updateSearch(newSearch: string) {
  emit("update:search", newSearch);
}

function updateOrder(newOrder: Order) {
  emit("update:order", newOrder);
}

function resetFilter() {
  emit("reset-filters-except-search");
}
</script>

<template>
  <div class="filter-panel">
    <WordsSearchInputComp
      :search="props.search"
      :search-placeholder="searchPlaceholder"
      :category-id="props.categoryId"
      :words-count-with-filters="props.wordsCountWithFilter"
      :hidden-words-count="hiddenWordsCount"
      appearance="outline"
      width="360px"
      @update:search="updateSearch"
      @reset-filter="resetFilter"
    />

    <div class="filter-panel__right">
      <div class="unconfirmed-switcher">
        <IconComp name="mark_status" color="negative" size="compact" />
        <span
          class="unconfirmed-switcher__label"
          v-text="t('only-unconfirmed')"
        />
        <SwitchComp v-model="switcherValue" />
      </div>
      <SelectComp
        :model-value="props.order"
        :options="orderOptions"
        appearance="inline"
        icon="sort"
        size="compact"
        :placeholder="t('to-sort')"
        compact
        @update:model-value="updateOrder"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 16px;

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;

    .unconfirmed-switcher {
      display: flex;
      align-items: center;

      &__label {
        @include text-body-2;
        margin-inline-end: 10px;
      }
    }
  }
}
</style>
