<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Id, Order, TranslationApprovedStatus } from "@/types/api";
import InputComp from "@/components/InputComp.vue";
import SelectComp from "@/components/SelectComp.vue";
import SwitchComp from "@/components/SwitchComp.vue";
import IconComp from "@/components/IconComp/index.vue";

type Props = {
  search: string;
  order: Order;
  translationApprovedStatus: TranslationApprovedStatus;
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
}>();

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
</script>

<template>
  <div class="filter-panel">
    <InputComp
      :model-value="props.search"
      appearance="outline"
      type="text"
      :placeholder="searchPlaceholder"
      left-icon="search"
      debounce
      width="360px"
      clear-button
      @update:model-value="updateSearch"
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
@import "@/styles/main";

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
