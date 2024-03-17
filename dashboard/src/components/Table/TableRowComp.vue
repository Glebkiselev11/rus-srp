<script lang="ts">
import type { Id } from "@/types/api";
import { vElementHover } from "@vueuse/components";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "TableRowComp",
  directives: {
    elementHover: vElementHover,
  },
  props: {
    id: {
      type: [String, Number] as PropType<Id>,
      default: null,
    },
    gridTemplateColumns: {
      type: String,
      required: true,
    },
  },
  emits: ["hover"],
  methods: {
    onHover(x: boolean) {
      this.$emit("hover", x);
    },
  },
});
</script>

<template>
  <tr
    v-element-hover="onHover"
    class="table-row"
    :style="{ gridTemplateColumns }"
  >
    <slot />
  </tr>
</template>

<style lang="scss">
@import "@/styles/main";

.table-row {
  height: 72px;
  display: grid;
  align-items: center;
  border-block-end: 1px solid $color-separator-primary;

  td {
    padding-inline: 16px;
  }
}
</style>
