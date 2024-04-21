<script setup lang="ts">
import type { IconName } from "@/types/icons";
import IconComp from "./IconComp/index.vue";

const props = defineProps<{
  icon: IconName;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="zero-state">
    <div class="zero-state__container">
      <IconComp :name="props.icon" />

      <h4>
        {{ props.title }}
      </h4>

      <span class="zero-state__description">
        {{ props.description }}
      </span>

      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.zero-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    max-width: 280px;
  }

  &__description {
    @include text-body-2;
    @extend .text-color-secondary;
  }
}
</style>
