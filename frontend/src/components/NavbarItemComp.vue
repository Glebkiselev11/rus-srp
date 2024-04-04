<script lang="ts">
import { defineComponent, type PropType } from "vue";
import IconComp from "@/components/IconComp/index.vue";
import type { IconName } from "../types/icons";

export default defineComponent({
  name: "NavbarItemComp",
  components: {
    IconComp,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String as PropType<IconName>,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    showLabels: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<template>
  <div class="navbar-item" :class="{ 'navbar-item--active': active }">
    <IconComp :name="iconName" :color="active ? 'accent-primary' : 'primary'" />

    <span
      v-if="showLabels"
      class="navbar-item__label"
      :class="{ 'navbar-item__label--active': active }"
    >
      {{ label }}
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
