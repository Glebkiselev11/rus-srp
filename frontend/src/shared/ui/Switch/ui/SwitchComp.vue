<script setup lang="ts">
type Props = {
  modelValue: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

function toggleChecked() {
  emit("update:modelValue", !props.modelValue);
}
</script>

<template>
  <label
    class="switch"
    :class="[
      { 'switch--disabled': props.disabled },
      { 'switch--checked': props.modelValue },
    ]"
  >
    <input
      type="checkbox"
      :checked="props.modelValue"
      :disabled="props.disabled"
      @change="toggleChecked"
    />
    <span class="switch__slider" />
  </label>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.switch {
  position: relative;
  width: 36px;
  height: 20px;

  input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;

    &:focus-visible ~ .switch__slider {
      @include focus-visible;
    }
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    width: inherit;
    height: inherit;
    border-radius: 50px;
    transition: background-color 0.2s;
    background: $color-background-content-secondary;

    &::before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      border-radius: 50%;
      left: 2px;
      bottom: 2px;
      transition: 0.2s;
      background-color: $color-icon-contrast;
      filter: drop-shadow(0 0 4px rgb(2 18 38 / 8%))
        drop-shadow(0 4px 8px rgb(2 18 38 / 4%));
    }

    &:hover {
      background-color: $color-background-secondary-hovered;
    }
  }

  &--checked {
    .switch__slider {
      background-color: $color-background-accent-primary;
    }

    .switch__slider::before {
      transform: translateX(16px);
    }

    &:hover {
      .switch__slider {
        background-color: $color-background-accent-primary-hovered;
      }
    }
  }

  &--disabled {
    pointer-events: none;

    .switch__slider {
      background-color: $color-background-disabled;
    }

    .switch__slider::before {
      background-color: $color-field-background;
    }
  }
}
</style>
