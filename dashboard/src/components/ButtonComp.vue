<script lang="ts">
import type { IconColor, IconName, IconSize } from "@/types/icons";
import IconComp from "@/components/IconComp/index.vue";
import { defineComponent, type PropType } from "vue";
import type {
  ButtonColor,
  ButtonSize,
  ButtonAppearance,
} from "@/types/buttons";
import SpinnerComp, { type SpinnerColor } from "./SpinnerComp.vue";

export default defineComponent({
  name: "ButtonComp",
  components: {
    IconComp,
    SpinnerComp,
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    icon: {
      type: String as PropType<IconName>,
      default: null,
    },
    color: {
      type: String as PropType<ButtonColor>,
      default: "accent-primary",
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: "regular",
    },
    appearance: {
      type: String as PropType<ButtonAppearance>,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String as PropType<IconColor>,
      default: null,
    },
    pressed: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  data() {
    return {
      buttonWidthOnMount: undefined as string | undefined,
    };
  },
  computed: {
    _iconColor(): IconColor {
      if (this.disabled) {
        return "disabled";
      }

      if (this.iconColor) {
        return this.iconColor;
      }

      if (this.color === "neutral") {
        return "primary";
      }

      if (this.appearance === "primary") {
        return "contrast";
      }

      return this.color;
    },
    _iconSize(): IconSize {
      if (this.size === "regular") {
        return "regular";
      } else {
        return "compact";
      }
    },
    _loaderColor(): SpinnerColor {
      if (this.appearance === "primary") {
        return "neutral";
      }

      return this.color;
    },

    _loaderSize() {
      if (this.size === "regular") {
        return "24";
      }

      return "20";
    },
  },
  mounted() {
    // Get the width of the button on mount and use it on loading state
    const button = this.$refs.button as HTMLButtonElement;
    this.buttonWidthOnMount = `${button.offsetWidth}px`;
  },
  methods: {
    onClick(e: MouseEvent) {
      if (this.loading) {
        return;
      }

      this.$emit("click", e);
    },
  },
});
</script>

<template>
  <button
    ref="button"
    class="button"
    :style="{ minWidth: buttonWidthOnMount }"
    :class="[
      `button--size-${size}`,
      `button--appearance-${appearance}`,
      `button--color-${color}`,
      { 'button--icon-and-label': icon && label },
      { 'button--only-icon': icon && !label },
      { 'button--only-label': label && !icon },
      { 'button--pressed': pressed },
      { 'button--full-width': fullWidth },
      { 'button--loading': loading },
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    <SpinnerComp v-if="loading" :size="_loaderSize" :color="_loaderColor" />

    <template v-else>
      <IconComp
        v-if="icon"
        :name="icon"
        :color="_iconColor"
        :size="_iconSize"
      />
      <template v-if="label">
        {{ label }}
      </template>

      <slot name="right" />
    </template>
  </button>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.button {
  @include text-subtitle-1;

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
      min-block-size: 40px;
      min-inline-size: 40px;
    }

    &-compact {
      min-block-size: 32px;
      min-inline-size: 32px;
    }

    &-small {
      min-block-size: 24px;
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
