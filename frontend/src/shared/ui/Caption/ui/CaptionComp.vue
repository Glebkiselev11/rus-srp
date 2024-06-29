<script setup lang="ts">
import { computed } from "vue";
import { IconComp, type IconSize, type IconName } from "@/shared/ui/Icon";
import type { Type } from "../model/types";

type Props = {
  text: string;
  size?: IconSize;
  type: Type;
  iconName?: IconName;
};

const props = withDefaults(defineProps<Props>(), {
  size: "compact",
  iconName: undefined,
});

const iconColor = computed(() => {
  switch (props.type) {
    case "error":
      return "negative";
    default:
      return "tertiary";
  }
});

const iconName = computed(() => {
  if (props.iconName) return props.iconName;

  switch (props.type) {
    case "error":
      return "error";

    default:
      return "check_circle";
  }
});
</script>

<template>
  <span class="caption">
    <IconComp :color="iconColor" :name="iconName" :size="props.size" />

    <span
      class="caption__text"
      :class="[
        `caption__text--size-${props.size}`,
        `caption__text--color-${props.type}`,
      ]"
      v-text="props.text"
    />
  </span>
</template>

<style scoped lang="scss">
.caption {
  display: flex;
  align-items: center;

  &__text {
    margin-inline-start: 8px;

    &--color-error {
      color: $color-text-negative;
    }

    &--color-neutral {
      color: $color-text-secondary;
    }

    &--size-small {
      @include text-caption-2;
    }

    &--size-compact {
      @include text-body-2;
    }

    &--size-regular {
      @include text-body-1;
    }
  }
}
</style>
