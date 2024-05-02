<script setup lang="ts">
type Props = {
  label: string;
  paddingBlock?: string;
  appearance?: "inline" | "secondary";
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  paddingBlock: "8px",
  appearance: "inline",
  disabled: false,
});
</script>

<template>
  <label
    class="checkbox-list-item"
    :class="[
      `checkbox-list-item--appearance-${props.appearance}`,
      { 'checkbox-list-item--disabled': props.disabled },
    ]"
    :style="{ paddingBlock: props.paddingBlock }"
  >
    {{ props.label }}
    <slot />
  </label>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.checkbox-list-item {
  @include text-body-2;

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
