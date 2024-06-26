<script setup lang="ts">
import { IconComp, type IconSize } from "@/shared/ui/Icon";

type Props = {
  text: string;
  size?: IconSize;
};

const props = withDefaults(defineProps<Props>(), {
  size: "compact",
});
</script>

<template>
  <span class="error">
    <IconComp color="negative" name="error" :size="props.size" />

    <span
      class="error__text"
      :class="[`error__text--${props.size}`]"
      v-text="props.text"
    />
  </span>
</template>

<style scoped lang="scss">
@import "@/styles/main";

.error {
  display: flex;
  align-items: center;

  &__text {
    margin-inline-start: 8px;
    color: $color-text-negative;

    &--small {
      @include text-caption-2;
    }

    &--compact {
      @include text-body-2;
    }

    &--regular {
      @include text-body-1;
    }
  }
}
</style>
