<script setup lang="ts">
import type { Size, Color } from "../model/types";

type Props = {
  size?: Size;
  color?: Color;
};

const props = withDefaults(defineProps<Props>(), {
  size: "20",
  color: "negative",
});
</script>

<template>
  <div class="spinner-wrap">
    <div
      class="spinner"
      :class="[`spinner--${props.size}`, `spinner--color-${props.color}`]"
    />
  </div>
</template>

<style lang="scss" scoped>
.spinner-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2px;
}

.spinner {
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;

  &--20 {
    width: 16px;
    height: 16px;
  }

  &--24 {
    width: 20px;
    height: 20px;
  }

  &::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border-style: solid;
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

  &--20::before {
    border-width: 1.5px;
  }

  &--24::before {
    border-width: 2px;
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
