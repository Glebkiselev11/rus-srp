<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "TooltipComp",
  props: {
    text: {
      type: String,
      required: true,
    },
    position: {
      type: String as PropType<
        "top" | "bottom" | "left" | "right" | "bottom-right"
      >,
      default: "bottom",
    },
    textWrap: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String as PropType<"dark" | "light">,
      default: "dark",
    },
  },
  data() {
    return {
      timeout: 0,
      showTooltip: false,
    };
  },
  methods: {
    show() {
      this.timeout = setTimeout(() => {
        this.showTooltip = true;
      }, 400);
    },
    hide() {
      this.showTooltip = false;
      if (this.timeout) clearTimeout(this.timeout);
    },
  },
});
</script>

<template>
  <div class="tooltip__container">
    <div @mouseenter="show" @mouseleave="hide" @click="hide">
      <slot />
    </div>

    <span
      v-show="showTooltip && !hidden"
      class="tooltip"
      :class="[
        `tooltip--${position}`,
        `tooltip--color-${color}`,
        textWrap ? 'tooltip--wrap' : '',
      ]"
    >
      {{ text }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

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
  z-index: 2;
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
