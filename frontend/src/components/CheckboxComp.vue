<script setup lang="ts">
import { computed } from "vue";
import { IconComp, type IconName } from "@/shared/ui/Icon";

type Props = {
  modelValue: boolean;
  indeterminated?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  indeterminated: false,
  disabled: false,
});

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const iconName = computed((): IconName => {
  if (props.indeterminated) {
    return "indeterminate_checkbox";
  } else if (props.modelValue) {
    return "checkbox";
  } else {
    return "checkbox_outline_blank";
  }
});

function toggleChecked() {
  emit("update:modelValue", !props.modelValue);
}
</script>

<template>
  <label
    class="checkbox"
    :class="[
      { 'checkbox--disabled': props.disabled },
      { 'checkbox--indeterminated': props.indeterminated },
      { 'checkbox--checked': props.modelValue },
    ]"
  >
    <input
      type="checkbox"
      :checked="props.modelValue"
      :disabled="props.disabled"
      @change="toggleChecked"
    />

    <div class="checkbox__fake-input">
      <IconComp :name="iconName" color="current-color" />
    </div>
  </label>
</template>

<style lang="scss" scoped>
@import "@/styles/main";

.checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  color: $color-icon-secondary;

  &:hover {
    cursor: pointer;
    color: $color-icon-primary;
  }

  &--indeterminated,
  &--checked {
    color: $color-icon-accent-primary;

    &:hover {
      color: $color-background-accent-primary-hovered;
    }
  }

  &--disabled {
    pointer-events: none;
    color: $color-icon-disabled;
  }

  input[type="checkbox"] {
    width: 0;
    height: 0;
    opacity: 0;

    &:focus-visible ~ .checkbox__fake-input {
      @include focus-visible;

      outline-offset: -3px;
    }
  }

  &__fake-input {
    width: 24px;
    height: 24px;
    border-radius: 2px;
  }
}
</style>
