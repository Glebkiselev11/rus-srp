<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "CheckboxListItemComp",
  props: {
    label: {
      type: String,
      required: true,
    },
    paddingBlock: {
      type: String,
      default: "8px",
    },
    appearance: {
      type: String as PropType<"inline" | "secondary">,
      default: "inline",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<template>
  <label
    class="checkbox-list-item"
    :class="[
      `checkbox-list-item--appearance-${appearance}`,
      { 'checkbox-list-item--disabled': disabled },
    ]"
    :style="{ paddingBlock }"
  >
    {{ label }}
    <slot />
  </label>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.checkbox-list-item {
  @include text-body-1;

  color: $color-text-primary;
  display: flex;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
  padding-inline: 12px;
  border-radius: 12px;

  &--appearance {
    &-inline {
      &:hover {
        background-color: $color-background-content-primary-hovered;
      }
    }

    &-secondary {
      background-color: $color-background-content-tertiary;

      &:hover {
        background-color: $color-background-tertiary-hovered;
      }
    }
  }

  &--disabled {
    pointer-events: none;
    color: $color-text-disabled;
  }
}
</style>
