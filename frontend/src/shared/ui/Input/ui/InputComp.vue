<script setup lang="ts" generic="T">
import { useI18n } from "vue-i18n";
import { useDebounceFn } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { IconComp, type IconName } from "@/shared/ui/Icon";
import { ButtonComp } from "@/shared/ui/Button";
import { InputWrapperComp } from "@/shared/ui/InputWrapper";
import { TooltipComp } from "@/shared/ui/Tooltip";
import type { Size, Appearance } from "../model/types";

type Props = {
  modelValue: T;
  label?: string;
  inputId?: string;
  type?: string;
  appearance?: Appearance;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  leftIcon?: IconName;
  debounce?: boolean;
  max?: number;
  min?: number;
  width?: string;
  size?: Size;
  clearButton?: boolean;
  focusOnMount?: boolean;
  resetValue?: T;
};

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  inputId: "input-id",
  type: "text",
  appearance: "default",
  placeholder: undefined,
  disabled: false,
  error: false,
  errorText: undefined,
  leftIcon: undefined,
  debounce: false,
  max: undefined,
  min: undefined,
  width: "100%",
  size: "regular",
  clearButton: false,
  focusOnMount: false,
  resetValue: undefined,
});

const emit = defineEmits<{
  (event: "update:modelValue", value: T): void;
  (event: "keypress", e: KeyboardEvent): void;
  (event: "focus"): void;
}>();

const input = ref<HTMLInputElement | null>(null);
const _modelValue = ref();

// This only need with autofill case
watch(
  () => props.modelValue,
  (value) => {
    _modelValue.value = value;
  }
);

onMounted(() => {
  if (props.focusOnMount) {
    setFocus();
  }

  _modelValue.value = props.modelValue;
});

const debounceEmit = useDebounceFn(() => {
  emitValue(_modelValue.value);
}, 500);

function emitValue(value: T) {
  emit("update:modelValue", value);
}

function handleInput() {
  if (
    (props.max && Number(_modelValue.value) > props.max) ||
    (props.min && Number(_modelValue.value) < props.min)
  ) {
    return;
  }
  props.debounce ? debounceEmit() : emitValue(_modelValue.value);
}

function setFocus() {
  input.value?.focus();
  emit("focus");
}

function clearInput() {
  emitValue("" as T);
  setFocus();
}

function resetInput() {
  if (props.resetValue === undefined) return;

  emitValue(props.resetValue);
  setFocus();
}
</script>

<template>
  <InputWrapperComp
    ref="wrapper"
    :label="props.label"
    :error="props.errorText"
    :for="props.inputId"
    :style="{ width: props.width }"
  >
    <div class="input" @keypress="(e) => emit('keypress', e)">
      <IconComp
        v-if="props.leftIcon"
        class="input--left-icon"
        :name="props.leftIcon"
        color="tertiary"
      />

      <input
        :id="props.inputId"
        ref="input"
        v-model="_modelValue"
        class="input__field"
        :class="[
          `input__field--size-${props.size}`,
          `input__field--appearance-${props.appearance}`,
        ]"
        :style="{ width: props.width }"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :error="props.error || Boolean(props.errorText)"
        :max="props.max"
        :min="props.min"
        autocomplete="off"
        @input="handleInput"
        @focus="emit('focus')"
      />

      <div class="input__buttons">
        <ButtonComp
          v-show="props.clearButton && props.modelValue"
          icon="cancel"
          color="neutral"
          :size="props.size"
          appearance="inline"
          icon-color="tertiary"
          @click="clearInput"
        />

        <TooltipComp :text="t('reset')" position="top">
          <ButtonComp
            v-show="props.resetValue && props.modelValue !== props.resetValue"
            icon="restart_alt"
            color="neutral"
            :size="props.size"
            appearance="inline"
            icon-color="tertiary"
            @click="resetInput"
          />
        </TooltipComp>
      </div>
    </div>
  </InputWrapperComp>
</template>

<style scoped lang="scss">
.input {
  position: relative;

  &:has(.input--left-icon) .input__field {
    padding-left: 40px;
  }

  &--left-icon {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
  }

  &__field {
    border-radius: 8px;
    border: 1px solid $color-separator-primary;
    padding: 0 8px;

    &--size {
      &-regular {
        @include text-body-1;

        height: 40px;
      }

      &-compact {
        @include text-body-2;

        height: 32px;
      }
    }

    &--appearance {
      &-default {
        background: $color-field-background;

        &:hover {
          background: $color-background-content-primary-hovered;
        }
      }

      &-outline {
        background: $color-background-content-primary;

        &:hover {
          border-color: $color-field-border-invert;
        }
      }
    }

    &:has(.input--left-icon) {
      padding-left: 48px;
    }

    &:disabled {
      pointer-events: none;

      &::placeholder {
        color: $color-text-disabled;
      }
    }

    &::placeholder {
      @include text-body-1;
      color: $color-text-placeholder;
    }

    &[error="true"] {
      outline: 1px solid $color-stroke-negative;
    }
  }

  &__buttons {
    position: absolute;
    inset-inline-end: 0;
    inset-block-start: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
