<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import SelectComp from "@/components/SelectComp.vue";
import InputComp from "@/components/InputComp.vue";
import PaginationComp from "./PaginationComp.vue";

const { t } = useI18n();

const props = defineProps<{
  count: number;
  offset: number;
  limit: number;
  limitOptions: { value: number; label: string }[];
}>();

const emit = defineEmits<{
  (event: "update:limit", value: number): void;
  (event: "update:offset", value: number): void;
}>();

const currentRange = computed(() => {
  const last = props.offset + props.limit;
  if (last > props.count) return `${props.offset + 1}-${props.count}`;

  return `${props.offset + 1}-${last}`;
});
const currentPage = computed(() => Math.ceil(props.offset / props.limit) + 1);
const lastPage = computed(() => Math.ceil(props.count / props.limit));
const showPaginationConrols = computed(() => props.count > props.limit);

function updateLimit(value: number) {
  emit("update:limit", value);
}

function changePage(value: number) {
  emit("update:offset", (value - 1) * props.limit);
}

function updateOffset(value: number) {
  emit("update:offset", value);
}
</script>

<template>
  <div class="pagination-bar">
    <div class="pagination-bar__section">
      <div class="count-info">
        {{ t("pagination.info", { currentRange, count: props.count }) }}
      </div>

      <div class="limit-controller">
        <span class="limit-controller__text">{{ t("pagination.show") }}</span>
        <SelectComp
          :model-value="props.limit"
          :options="props.limitOptions"
          size="compact"
          appearance="filled"
          @update:model-value="updateLimit"
        />
      </div>
    </div>

    <div v-if="showPaginationConrols" class="pagination-bar__section">
      <div class="select-page-controller">
        <span class="select-page-controller__text">
          {{ t("pagination.select-page") }}
        </span>

        <InputComp
          type="number"
          :model-value="currentPage"
          :min="1"
          :max="lastPage"
          :debounce="true"
          width="56px"
          size="compact"
          @update:model-value="changePage"
        />
      </div>

      <PaginationComp
        :limit="props.limit"
        :offset="props.offset"
        :count="props.count"
        @update:offset="updateOffset"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.pagination-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding-inline: 16px;
  border-block-start: 1px solid $color-separator-primary;
  background-color: $color-background-content-primary;

  &__section {
    display: flex;
    align-items: center;
    column-gap: 24px;
  }

  .count-info {
    @include text-subtitle-2;

    color: $color-text-secondary;
  }

  .limit-controller {
    display: flex;
    align-items: center;

    &__text {
      @include text-body-2;

      color: $color-text-secondary;
      margin-inline-end: 8px;
    }
  }

  .select-page-controller {
    display: flex;
    align-items: center;

    &__text {
      @include text-body-2;

      color: $color-text-secondary;
      margin-inline-end: 8px;
    }
  }
}
</style>
