<script setup lang="ts" generic="T">
import { computed } from "vue";
import { InputWrapperComp } from "@/shared/ui/InputWrapper";
import { DropdownMenuComp } from "@/shared/ui/DropdownMenu";
import { IconComp, type IconName } from "@/shared/ui/Icon";
import type { Size, Appearance } from "../model/types";

type Props = {
  modelValue: T;
  options: { value: T; label: string }[];
  appearance?: Appearance;
  size?: Size;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: IconName;
};

const props = withDefaults(defineProps<Props>(), {
  appearance: "default",
  size: "regular",
  label: undefined,
  placeholder: "",
  disabled: false,
  icon: undefined,
});

const emit = defineEmits<{
  (event: "update:modelValue", value: T): void;
}>();

const items = computed(() =>
  props.options.map((item) => ({
    ...item,
    handler: () => {
      emit("update:modelValue", item.value);
    },
  }))
);

const selectedItem = computed(() => {
  const item = props.options.find((item) => item.value === props.modelValue);
  return item ? item.label : props.placeholder;
});
</script>

<template>
  <InputWrapperComp :label="props.label" for="select">
    <DropdownMenuComp :items="items" :disabled="props.disabled">
      <template #trigger="{ isMenuOpen }">
        <button
          id="select"
          class="select"
          :disabled="props.disabled"
          :class="[
            `select--appearance-${props.appearance}`,
            `select--size-${props.size}`,
            { 'select--menu-open': isMenuOpen },
            { 'select--with-icon': props.icon },
          ]"
        >
          <IconComp
            v-if="props.icon"
            :name="props.icon"
            size="compact"
            color="secondary"
          />

          {{ selectedItem }}

          <IconComp
            :name="isMenuOpen ? 'expand_more_up' : 'expand_more_down'"
            size="compact"
            color="tertiary"
          />
        </button>
      </template>
    </DropdownMenuComp>
  </InputWrapperComp>
</template>

<style lang="scss" scoped>
.select {
  border-radius: 8px;
  padding-block: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  &--appearance {
    &-default {
      border: 1px solid $color-separator-primary;
    }

    &-inline {
      background: transparent;
    }

    &-inline,
    &-filled {
      border: none;
    }

    &-filled {
      background: $color-background-content-tertiary;
    }
  }

  &--size {
    &-regular {
      @include text-body-1;

      height: 40px;
      padding-inline: 16px;
      column-gap: 8px;
    }

    &-compact {
      @include text-body-2;

      height: 32px;
      column-gap: 6px;
      padding-inline: 8px;
    }
  }

  &--with-icon {
    &.select--size-regular {
      padding-inline: 8px;
      column-gap: 8px;
    }

    &.select--size-compact {
      padding-inline: 6px;
    }
  }

  &:hover {
    &.select--appearance-default,
    &.select--appearance-inline {
      background-color: $color-background-content-primary-hovered;
    }

    &.select--appearance-filled {
      background-color: $color-background-tertiary-hovered;
    }
  }

  &:active,
  &.select--menu-open {
    &.select--appearance-default,
    &.select--appearance-inline {
      background-color: $color-background-content-primary-active;
    }

    &.select--appearance-filled {
      background-color: $color-background-tertiary-active;
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
