<script setup lang="ts">
import { computed } from "vue";

type Props = {
  width?: string;
  height?: string;
  randomWidth?: boolean;
  borderRadius?: string;
};

const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "100%",
  randomWidth: false,
  borderRadius: "0",
});

const _width = computed(() => {
  if (!props.randomWidth) {
    return props.width;
  }

  const randomWidth = Math.random() * 100;
  return randomWidth < 50 ? `${randomWidth + 50}%` : `${randomWidth}%`;
});
</script>

<template>
  <div
    class="skeleton-item"
    :style="{
      width: _width,
      height: props.height,
      borderRadius: props.borderRadius,
    }"
  />
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.skeleton-item {
  background: linear-gradient(
    to right,
    $color-background-content-tertiary,
    $color-background-content-secondary,
    $color-background-content-tertiary
  );
  background-size: 200% 100%;
  animation: gradientShift 2s linear infinite;
}

@keyframes gradientShift {
  0% {
    background-position: -100% 50%;
  }

  50% {
    background-position: 50% 100%;
  }

  100% {
    background-position: -100% 50%;
  }
}
</style>
