<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CounterComp",
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
});
</script>

<template>
  <div class="counter">
    {{ count }}
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.counter {
  @include text-caption-2;

  padding-block: 2px;
  padding-inline: 6px;
  text-align: center;
  height: 20px;
  min-width: 20px;
  border-radius: 100px;
  background: $color-background-content-primary;
  color: $color-text-accent-primary;
}
</style>
