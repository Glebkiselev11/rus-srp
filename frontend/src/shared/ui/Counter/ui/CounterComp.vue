<script setup lang="ts">
import type { Color } from "../model/types";

type Props = {
  count: number;
  color?: Color;
};

const props = withDefaults(defineProps<Props>(), {
  color: "neutral",
});
</script>

<template>
  <div class="counter" :class="`counter--color-${props.color}`">
    {{ props.count }}
  </div>
</template>

<style lang="scss" scoped>
.counter {
  @include text-caption-2;

  padding-block: 2px;
  padding-inline: 6px;
  text-align: center;
  height: 20px;
  min-width: 20px;
  border-radius: 100px;

  &--color-neutral {
    background: $color-background-content-secondary;
    color: $color-text-primary;
  }

  &--color-accent-primary {
    background: $color-text-accent-primary;
    color: $color-text-contrast;
  }
}
</style>
