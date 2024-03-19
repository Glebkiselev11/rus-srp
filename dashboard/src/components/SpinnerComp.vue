<script lang="ts">
import { defineComponent, type PropType } from "vue";

export type SpinnerSize = "20" | "24";
export type SpinnerColor =
  | "neutral"
  | "accent-primary"
  | "accent-secondary"
  | "negative"
  | "primary";

export default defineComponent({
  name: "SpinnerComp",
  props: {
    size: {
      type: String as PropType<SpinnerSize>,
      default: "20",
    },
    color: {
      type: String as PropType<SpinnerColor>,
      default: "red",
    },
  },
  computed: {
    _size(): string {
      return `loader--${this.size}`;
    },
  },
});
</script>

<template>
  <div
    class="spinner"
    :class="[`spinner--${size}`, `spinner--color-${color}`]"
  />
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.spinner {
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;

  &--24 {
    width: 24px;
    height: 24px;
  }

  &--20 {
    width: 20px;
    height: 20px;
  }

  &::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 4px solid;
    animation: prixClipFix 3s linear infinite;
  }

  &--color-neutral::before {
    border-color: $color-icon-contrast;
  }

  &--color-accent-primary::before {
    border-color: $color-icon-accent-primary;
  }

  &--color-accent-secondary::before {
    border-color: $color-icon-accent-secondary;
  }

  &--color-negative::before {
    border-color: $color-icon-negative;
  }

  &--color-primary::before {
    border-color: $color-icon-primary;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes prixClipFix {
    0% {
      clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
    }
    25% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
    }
    50% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
    }
    75% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
    }
    100% {
      clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
    }
  }
}
</style>
