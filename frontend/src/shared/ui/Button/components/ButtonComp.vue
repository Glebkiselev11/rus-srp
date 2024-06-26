<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Color, Size, Appearance } from "../types";
import SpinnerComp, { type SpinnerColor } from "@/components/SpinnerComp.vue";
import {
  IconComp,
  type IconColor,
  type IconName,
  type IconSize,
} from "@/shared/ui/Icon";

type Props = {
  label?: string;
  icon?: IconName;
  color?: Color;
  size?: Size;
  appearance?: Appearance;
  disabled?: boolean;
  iconColor?: IconColor;
  pressed?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  icon: undefined,
  color: "accent-primary",
  size: "regular",
  appearance: "primary",
  disabled: false,
  iconColor: undefined,
  pressed: false,
  fullWidth: false,
  loading: false,
});

const emit = defineEmits<{
  (event: "click", e: MouseEvent): void;
}>();

const button = ref<HTMLButtonElement | null>(null);
const buttonWidthOnMount = ref<string | undefined>(undefined);

const iconColor = computed(() => {
  if (props.disabled) {
    return "disabled";
  }

  if (props.iconColor) {
    return props.iconColor;
  }

  if (props.color === "neutral") {
    return "primary";
  }

  if (props.appearance === "primary") {
    return "contrast";
  }

  return props.color;
});

const iconSize = computed((): IconSize => {
  if (props.size === "regular") {
    return "regular";
  }

  return "compact";
});

const loaderColor = computed((): SpinnerColor => {
  if (props.appearance === "primary") {
    return "neutral";
  }

  if (props.color === "neutral") {
    return "primary";
  }

  return props.color;
});

const loaderSize = computed(() => {
  if (props.size === "regular") {
    return "24";
  }

  return "20";
});

onMounted(() => {
  // Get the width of the button on mount and use it on loading state
  buttonWidthOnMount.value = `${button.value?.offsetWidth}px`;
});

function onClick(e: MouseEvent) {
  if (props.loading) {
    return;
  }

  emit("click", e);
}
</script>

<template>
  <button
    ref="button"
    class="button"
    :style="{ minWidth: buttonWidthOnMount }"
    :class="[
      `button--size-${props.size}`,
      `button--appearance-${props.appearance}`,
      `button--color-${props.color}`,
      { 'button--icon-and-label': props.icon && props.label },
      { 'button--only-icon': props.icon && !props.label },
      { 'button--only-label': props.label && !props.icon },
      { 'button--pressed': props.pressed },
      { 'button--full-width': props.fullWidth },
      { 'button--loading': props.loading },
    ]"
    :disabled="props.disabled"
    @click="onClick"
  >
    <SpinnerComp
      v-if="props.loading && !props.icon"
      :size="loaderSize"
      :color="loaderColor"
    />

    <template v-else>
      <template v-if="props.icon">
        <SpinnerComp
          v-if="props.loading"
          :size="loaderSize"
          :color="loaderColor"
        />

        <IconComp
          v-else
          :name="props.icon"
          :color="iconColor"
          :size="iconSize"
        />
      </template>

      <template v-if="props.label">
        {{ props.label }}
      </template>

      <slot name="right" />
    </template>
  </button>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  border-radius: 8px;

  &--loading {
    pointer-events: none;
  }

  /* Paggings for Icon and label case */
  &--icon-and-label {
    &.button--size-regular {
      padding-block: 8px;
      padding-inline: 12px 16px;
    }

    &.button--size-compact {
      padding-block: 6px;
      padding-inline: 8px 12px;
    }

    &.button--size-small {
      padding-block: 2px;
      padding-inline: 4px 8px;
    }
  }

  /* Paddings for Only icon case */
  &--only-icon {
    &.button--size-regular {
      padding: 8px;
    }

    &.button--size-compact {
      padding: 6px;
    }

    &.button--size-small {
      padding: 2px;
    }
  }

  /* Paddings for Only label case */
  &--only-label {
    &.button--size-regular {
      padding-block: 10px;
      padding-inline: 16px;
    }

    &.button--size-compact {
      padding-block: 6px;
      padding-inline: 12px;
    }

    &.button--size-small {
      padding-block: 2px;
      padding-inline: 8px;
    }
  }

  &--size {
    &-regular {
      @include text-subtitle-1;
      block-size: 40px;
      min-inline-size: 40px;
    }

    &-compact {
      @include text-subtitle-2;
      block-size: 32px;
      min-inline-size: 32px;
    }

    &-small {
      @include text-subtitle-2;
      block-size: 24px;
      min-inline-size: 24px;
    }
  }

  &--appearance {
    &-primary {
      &.button--color-accent-primary {
        background-color: $color-text-accent-primary;
        color: $color-text-contrast;
      }

      &.button--color-accent-secondary {
        background-color: $color-background-accent-secondary;
        color: $color-text-contrast;
      }

      &.button--color-negative {
        background-color: $color-background-negative;
        color: $color-text-contrast;
      }

      &.button--color-neutral {
        background-color: $color-background-content-secondary;
        color: $color-text-primary;
      }
    }

    &-secondary {
      background-color: $color-background-content-tertiary;

      &.button--color-accent-primary {
        color: $color-text-accent-primary;
      }

      &.button--color-accent-secondary {
        color: $color-text-accent-secondary;
      }

      &.button--color-negative {
        color: $color-text-negative;
      }

      &.button--color-neutral {
        color: $color-text-primary;
      }
    }

    &-inline {
      background: none;

      &.button--color-accent-primary {
        color: $color-text-accent-primary;
      }

      &.button--color-accent-secondary {
        color: $color-text-accent-secondary;
      }

      &.button--color-negative {
        color: $color-text-negative;
      }

      &.button--color-neutral {
        color: $color-text-primary;
      }
    }
  }

  &--full-width {
    width: 100%;
  }

  &:hover {
    &.button--appearance-primary {
      &.button--color-accent-primary {
        background-color: $color-background-accent-primary-hovered;
      }

      &.button--color-accent-secondary {
        background-color: $color-background-accent-secondary-hovered;
      }

      &.button--color-negative {
        background-color: $color-background-negative-hovered;
      }

      &.button--color-neutral {
        background-color: $color-background-secondary-hovered;
      }
    }

    &.button--appearance-secondary {
      background-color: $color-background-tertiary-hovered;
    }

    &.button--appearance-inline {
      background-color: $color-background-content-primary-hovered;
    }
  }

  &--pressed {
    &.button--appearance-primary {
      &.button--color-accent-primary {
        background-color: $color-background-accent-primary-active;
      }

      &.button--color-accent-secondary {
        background-color: $color-background-accent-secondary-active;
      }

      &.button--color-negative {
        background-color: $color-background-negative-active;
      }

      &.button--color-neutral {
        background-color: $color-background-secondary-active;
      }
    }

    &.button--appearance-secondary {
      background-color: $color-background-tertiary-active;
    }

    &.button--appearance-inline {
      background-color: $color-background-content-primary-active;
    }
  }

  &:active {
    @extend .button--pressed;
  }

  &:disabled {
    pointer-events: none;
    color: $color-text-disabled;

    &.button--appearance-secondary,
    &.button--appearance-primary {
      background: $color-background-disabled;
    }
  }
}
</style>
