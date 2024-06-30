<script setup lang="ts">
import type { Id } from "@/shared/types";
import { vElementHover } from "@vueuse/components";
import type { PropType } from "vue";

defineProps({
  id: {
    type: [String, Number] as PropType<Id>,
    default: null,
  },
  gridTemplateColumns: {
    type: String,
    required: true,
  },
  highlightOnHover: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "hover", x: boolean): void;
}>();

function onHover(x: boolean) {
  emit("hover", x);
}
</script>

<template>
  <tr
    v-element-hover="onHover"
    class="table-row"
    :class="{ 'table-row--highlight-on-hover': highlightOnHover }"
    :style="{ gridTemplateColumns }"
  >
    <slot />
  </tr>
</template>

<style lang="scss">
.table-row {
  height: 64px;
  display: grid;
  align-items: center;
  border-block-end: 1px solid $color-separator-primary;

  &--highlight-on-hover:hover {
    background: $color-background-content-primary-hovered;
  }

  td {
    padding-inline: 12px;
  }
}
</style>
