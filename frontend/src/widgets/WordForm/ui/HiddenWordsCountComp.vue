<script setup lang="ts">
import { CounterComp } from "@/shared/ui/Counter";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  count: number;
}>();
</script>

<template>
  <div class="hidden-words-count">
    <span class="hidden-words-count__text" v-text="t('show-all-results')" />

    <CounterComp :count="props.count" color="accent-primary" />
  </div>
</template>

<style lang="scss" scoped>
.hidden-words-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 310px;

  &__text {
    @include text-body-1;
    color: $color-text-accent-primary;
  }
}
</style>
