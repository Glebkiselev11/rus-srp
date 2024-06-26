<script setup lang="ts">
import { computed } from "vue";
import { IconComp, type IconName, type IconColor } from "@/shared/ui/Icon";
import type { Order, SortKey } from "../../types/api";

type Props = {
  label?: string;
  icon?: { name: IconName; color: IconColor };
  width?: string;
  sortable?: boolean;
  order?: Order;
  sortKey?: SortKey;
};

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  icon: undefined,
  width: "auto",
  sortable: false,
  order: undefined,
  sortKey: undefined,
});

const emit = defineEmits<{
  (event: "update:order", order?: Order): void;
}>();

const sortActive = computed(() => {
  return props.order === props.sortKey || props.order === `-${props.sortKey}`;
});

const iconColor = computed(() => {
  return sortActive.value ? "accent-primary" : props.icon?.color;
});

const sortIconColor = computed(() => {
  if (sortActive.value) return "accent-primary";
  return "tertiary";
});

const sortIcon = computed(() => {
  if (props.order === props.sortKey) return "arrow_downward_alt";
  if (props.order === `-${props.sortKey}`) return "arrow_upward_alt";
  return "expand_all";
});

function handlerSort() {
  if (!props.sortable || !props.sortKey) return;

  if (props.order !== props.sortKey && props.order !== `-${props.sortKey}`) {
    emit("update:order", props.sortKey);
  } else if (props.order === props.sortKey) {
    emit("update:order", `-${props.sortKey}`);
  } else {
    emit("update:order", undefined);
  }
}
</script>

<template>
  <th :style="{ width }">
    <div class="table-column-title__outer">
      <button
        class="table-column-title"
        :class="{ 'table-column-title--sortable': sortable }"
        :disabled="!sortable"
        @click="handlerSort"
      >
        <IconComp v-if="icon" :name="icon.name" :color="iconColor" />
        <span
          v-if="label"
          class="table-column-title__label"
          :class="{ 'table-column-title__label--active-sort': sortActive }"
          v-text="label"
        />

        <IconComp
          v-if="sortable"
          :name="sortIcon"
          :color="sortIconColor"
          size="compact"
        />
      </button>
    </div>
  </th>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

$padding: 8px;

.table-column-title__outer {
  display: flex;
  justify-content: flex-start;
  margin-inline-start: -$padding;
  height: 32px;
}

.table-column-title {
  display: flex;
  align-items: center;
  column-gap: 4px;
  border-radius: 8px;
  padding: $padding;
  border: none;
  background: transparent;

  &--sortable {
    cursor: pointer;

    &:hover {
      background-color: $color-background-content-primary-hovered;
    }
  }

  &__label {
    @include text-body-2;

    color: $color-text-secondary;

    &--active-sort {
      color: $color-text-accent-primary;
    }
  }
}
</style>
