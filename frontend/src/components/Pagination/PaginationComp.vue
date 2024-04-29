<script setup lang="ts">
import { computed } from "vue";
import ButtonComp from "@/components/ButtonComp.vue";
import PaginationButtonComp from "./PaginationButtonComp.vue";

const BEFORE_AND_AFTER_ELLIPSIS = 2;

const props = defineProps<{
  limit: number;
  offset: number;
  count: number;
}>();

const emit = defineEmits<{
  (event: "update:offset", offset: number): void;
}>();

const currentPage = computed(() => Math.ceil(props.offset / props.limit) + 1);
const lastPage = computed(() => Math.ceil(props.count / props.limit));
const isSmallList = computed(
  () => lastPage.value <= 3 + BEFORE_AND_AFTER_ELLIPSIS * 2
);
const middleNumbers = computed(() => {
  // Here we establish buttons near current button.
  // For example current is 15 and last page is 20:
  // it will looks like [1]...[13][14][15][16][17]...[20]
  return isSmallList.value
    ? getRange(2, lastPage.value - 2)
    : getRange(
        currentPage.value - BEFORE_AND_AFTER_ELLIPSIS,
        1 + BEFORE_AND_AFTER_ELLIPSIS * 2
      ).filter((page) => page > 1 && page < lastPage.value);
});
const ellipsisBeforeMiddle = computed(
  () => currentPage.value > 4 && !isSmallList.value
);
const ellipsisAfterMiddle = computed(
  () => currentPage.value < lastPage.value - 3 && !isSmallList.value
);

function getRange(start: number, length: number) {
  return length > 0 ? [...Array(length).keys()].map((val) => val + start) : [];
}

function isCurrentPage(page: number): boolean {
  return page === currentPage.value;
}

function changePage(page: number) {
  updateOffset((page - 1) * props.limit);
}

function prevPage() {
  changePage(currentPage.value - 1);
}

function nextPage() {
  changePage(currentPage.value + 1);
}

function updateOffset(value: number) {
  emit("update:offset", value);
}
</script>

<template>
  <div class="pagination">
    <ButtonComp
      icon="navigate_before"
      :disabled="currentPage === 1"
      appearance="inline"
      size="compact"
      color="neutral"
      @click="prevPage"
    />

    <div class="pagination__pages">
      <PaginationButtonComp
        label="1"
        :active="isCurrentPage(1)"
        @click="changePage(1)"
      />

      <span v-show="ellipsisBeforeMiddle" class="pagination__ellipses">
        ...
      </span>

      <PaginationButtonComp
        v-for="page in middleNumbers"
        :key="page"
        :label="page.toString()"
        :active="isCurrentPage(page)"
        @click="changePage(page)"
      />

      <span v-show="ellipsisAfterMiddle" class="pagination__ellipses">
        ...
      </span>

      <PaginationButtonComp
        :label="lastPage.toString()"
        :active="isCurrentPage(lastPage)"
        @click="changePage(lastPage)"
      />
    </div>

    <ButtonComp
      icon="navigate_next"
      :disabled="currentPage === lastPage"
      appearance="inline"
      size="compact"
      color="neutral"
      @click="nextPage"
    />
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  column-gap: 8px;

  &__pages {
    display: inherit;
    align-items: flex-end;
  }

  &__ellipses {
    width: 32px;
    text-align: center;
    padding-block-end: 6px;
    pointer-events: none;
  }
}
</style>
