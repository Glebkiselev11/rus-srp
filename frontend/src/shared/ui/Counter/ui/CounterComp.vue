<script setup lang="ts">
const props = defineProps<{
  count: number;
}>();
</script>

<template>
  <div class="counter">
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
  background: $color-background-content-secondary;
  color: $color-text-primary;
}
</style>
