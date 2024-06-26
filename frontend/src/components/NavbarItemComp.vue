<script setup lang="ts">
import { IconComp, type IconName } from "@/shared/ui/Icon";

type Props = {
  iconName: IconName;
  active?: boolean;
  label?: string;
  showLabels?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  active: false,
  label: "",
  showLabels: false,
});
</script>

<template>
  <div class="navbar-item" :class="{ 'navbar-item--active': props.active }">
    <IconComp
      :name="props.iconName"
      :color="props.active ? 'accent-primary' : 'primary'"
    />

    <span
      v-if="props.showLabels"
      class="navbar-item__label"
      :class="{ 'navbar-item__label--active': props.active }"
    >
      {{ props.label }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.navbar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 12px;
  block-size: 40px;
  inline-size: 40px;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: $color-background-content-primary-hovered;
  }

  &--active {
    background-color: $color-background-accent-primary-tint;

    &:hover {
      cursor: default;

      @extend .navbar-item--active;
    }
  }

  &__label {
    @include text-body-2;

    color: $color-text-primary;

    &--active {
      color: $color-text-accent-primary;
    }
  }
}
</style>
