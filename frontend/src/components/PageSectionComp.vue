<script setup lang="ts">
import { HeaderComp } from "@/shared/ui/Header";

type Props = {
  title?: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
});
</script>

<template>
  <div class="page-section">
    <HeaderComp v-if="props.title" :title="props.title" />

    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-section {
  background: $color-background-content-primary;
  width: 549px;
  border-radius: 16px;
  padding: 8px;
  border: 1px solid $color-separator-primary;
}
</style>
