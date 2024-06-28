<script setup lang="ts">
import { ref } from "vue";
import type { Position, Color } from "../types";

type Props = {
  text: string;
  position?: Position;
  textWrap?: boolean;
  hidden?: boolean;
  color?: Color;
};

const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
  textWrap: false,
  hidden: false,
  color: "dark",
});

const timeout = ref<ReturnType<typeof setTimeout>>();
const showTooltip = ref(false);

const show = () => {
  timeout.value = setTimeout(() => {
    showTooltip.value = true;
  }, 400);
};

const hide = () => {
  showTooltip.value = false;
  if (timeout.value) clearTimeout(timeout.value);
};
</script>

<template>
  <div class="tooltip__container">
    <div @mouseenter="show" @mouseleave="hide" @click="hide">
      <slot />
    </div>

    <span
      v-show="showTooltip && !props.hidden"
      class="tooltip"
      :class="[
        `tooltip--${props.position}`,
        `tooltip--color-${props.color}`,
        props.textWrap ? 'tooltip--wrap' : '',
      ]"
    >
      {{ props.text }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.tooltip__container {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.tooltip__triangle {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  rotate: 45deg;
  background: inherit;
  border-radius: 2px;
  box-shadow: -2px -2px 2px -1px $shadow;
}

.tooltip {
  @include text-caption-2;

  position: absolute;
  text-align: center;
  min-width: 100%;
  z-index: 4;
  border-radius: 8px;
  padding: 8px 12px;
  text-wrap: nowrap;
  box-shadow:
    0 4px 16px 0 $shadow,
    0 0 2px 0 $shadow;

  &--wrap {
    text-wrap: wrap;
  }

  &--color-dark {
    background: $color-background-tooltip;
    color: $color-text-contrast;
  }

  &--color-light {
    background: $color-background-content-primary;
    color: $color-text-primary;
  }

  &--bottom {
    top: calc(100% + 10px);
    left: 50%;
    translate: -50% 0;

    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--bottom;

      top: -4px;
    }
  }

  &--right {
    top: 50%;
    left: calc(100% + 10px);
    translate: 0 -50%;

    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--right;

      left: -4px;
    }
  }

  &--bottom-right {
    top: calc(100% + 10px);
    left: calc(100% + 10px);
    translate: -38px 4px;

    &::before {
      @extend .tooltip__triangle;

      top: -4px;
      left: 16px;
    }
  }

  &--left {
    top: 50%;
    right: calc(100% + 10px);
    translate: 0 -50%;

    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--left;

      right: -4px;
    }
  }

  &--top {
    bottom: calc(100% + 10px);
    left: 50%;
    translate: -50% 0;

    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--top;

      bottom: -4px;
    }
  }
}
</style>
