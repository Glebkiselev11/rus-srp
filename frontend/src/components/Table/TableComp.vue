<script setup lang="ts">
import { onUpdated, ref } from "vue";
import TableColumnTitleComp from "./TableColumnTitleComp.vue";
import type { Order } from "../../types/api";
import type { TableColumn } from "@/types/table";
import { vInfiniteScroll } from "@vueuse/components";
import type { UseInfiniteScrollOptions } from "@vueuse/core";

type Props = {
  gridTemplateColumns: string;
  columns?: TableColumn[];
  order?: Order;
  infiniteScrollConfig?: UseInfiniteScrollOptions;
  tableHeight?: string;
};

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  infiniteScrollConfig: () => ({
    // it will disable the interval for the case when we don't need to infinite scroll
    interval: 9999999,
  }),
  order: undefined,
  tableHeight: "700px",
});

const emit = defineEmits<{
  (event: "update:order", o?: Order): void;
  (event: "scrollToBottom"): void;
}>();

const isContentBodyScrollable = ref(false);

onUpdated(() => {
  setStateForTableBody();
});

function setStateForTableBody() {
  const tableBody = ref<HTMLTableSectionElement | null>(null);

  if (!tableBody.value) {
    isContentBodyScrollable.value = false;
    return;
  }

  isContentBodyScrollable.value =
    tableBody.value.scrollHeight > tableBody.value.clientHeight;
}

function handleScrollToBottom() {
  emit("scrollToBottom");
}
</script>

<template>
  <div class="table-wrap">
    <table class="table" :style="{ height: props.tableHeight }">
      <thead
        v-if="props.columns.length"
        class="table__header"
        :class="{ 'table__header--scrollable-body': isContentBodyScrollable }"
      >
        <tr :style="{ gridTemplateColumns: props.gridTemplateColumns }">
          <TableColumnTitleComp
            v-for="col in columns"
            :key="col.sort_key"
            :sort-key="col.sort_key"
            :style="{ width: col.width ?? 'auto' }"
            :label="col.label"
            :icon="col.icon"
            :width="col.width"
            :sortable="col.sortable"
            :order="props.order"
            @update:order="(x) => $emit('update:order', x)"
          />
        </tr>
      </thead>
      <tbody
        ref="tableBody"
        v-infinite-scroll="[handleScrollToBottom, props.infiniteScrollConfig]"
        class="table__body"
      >
        <slot />
      </tbody>

      <slot name="pagination" />
    </table>
  </div>
</template>

<style lang="scss">
.table-wrap {
  display: flex;
  flex-direction: column;
  border: 1px solid $color-separator-primary;
  border-radius: 8px;
  overflow: hidden;
}

.table {
  width: 100%;
  background: $color-background-content-primary;
  border-collapse: collapse;
  display: flex;
  flex-direction: column;

  &__header {
    display: block;
    height: 48px;
    border-block-end: 1px solid $color-separator-primary;

    tr {
      display: grid;
      align-items: center;
      height: inherit;

      th {
        padding-inline: 12px;
      }
    }

    &--scrollable-body {
      padding-inline-end: 4px;
    }
  }

  &__body {
    flex: 1; // This allows the body to expand and fill the available space
    overflow-y: auto;

    tr:last-child {
      border-block-end: none;
    }
  }
}
</style>
