<script setup lang="ts">
type Size = "regular" | "compact";

type Props = {
  clickable?: boolean;
  size?: Size;
  selected?: boolean;
  paddingInline?: string;
};

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  size: "regular",
  selected: false,
  paddingInline: "16px",
});
</script>

<template>
  <div
    class="list-item"
    :class="{
      'list-item--clickable': props.clickable,
      'list-item--selected': props.selected,
      'list-item--compact': props.size === 'compact',
    }"
    :style="{
      paddingInline: props.paddingInline,
    }"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.list-item {
  padding-block: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  column-gap: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;

  &--clickable {
    cursor: pointer;

    &:hover {
      background-color: $color-background-content-primary-hovered;
    }
  }

  &--selected {
    cursor: default;
    background-color: $color-background-content-primary-active;

    &:hover {
      @extend .list-item--selected;
    }
  }

  &--compact {
    padding-block: 8px;
  }
}
</style>
