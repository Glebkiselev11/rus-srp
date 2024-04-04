<script lang="ts">
import { debounce } from "lodash";
import { type PropType, defineComponent } from "vue";
import type { IconName } from "../types/icons";
import IconComp from "./IconComp/index.vue";
import ButtonComp from "./ButtonComp.vue";
import InputWrapperComp from "./InputWrapperComp.vue";
import TooltipComp from "./TooltipComp.vue";
import type { InputSize, InputAppearance } from "@/types/input";

export default defineComponent({
  name: "InputComp",
  components: {
    IconComp,
    ButtonComp,
    InputWrapperComp,
    TooltipComp,
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    inputId: {
      type: String,
      default: "input-id",
    },
    type: {
      type: String,
      default: "text",
    },
    appearance: {
      type: String as PropType<InputAppearance>,
      default: "default",
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    placeholder: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
      default: null,
    },
    leftIcon: {
      type: String as PropType<IconName>,
      default: null,
    },
    debounce: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: null,
    },
    min: {
      type: Number,
      default: null,
    },
    width: {
      type: String,
      default: "100%",
    },
    size: {
      type: String as PropType<InputSize>,
      default: "regular",
    },
    clearButton: {
      type: Boolean,
      default: false,
    },
    focusOnMount: {
      type: Boolean,
      default: false,
    },
    // If provided - show reset button
    resetValue: {
      type: [String, Number],
      default: undefined,
    },
  },
  emits: ["update:modelValue", "keypress"],
  data() {
    return {
      value: this.modelValue,
    };
  },
  watch: {
    // This only need with autofill case
    modelValue(value: string | number) {
      this.value = value;
    },
  },
  mounted() {
    if (this.focusOnMount) {
      this.setFocus();
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debounceEmit: debounce(function (this: any, value: unknown) {
      this.emitValue(value);
    }, 500),
    emitValue(value: unknown) {
      this.$emit("update:modelValue", value);
    },
    handleInput() {
      if (
        (this.max && Number(this.value) > this.max) ||
        (this.min && Number(this.value) < this.min)
      ) {
        return;
      }
      this.debounce
        ? this.debounceEmit(this.value)
        : this.emitValue(this.value);
    },
    setFocus() {
      const input = this.$refs.input as HTMLInputElement;
      input.focus();
    },
    clearInput() {
      this.emitValue("");
      this.setFocus();
    },
    resetInput() {
      this.emitValue(this.resetValue);
      this.setFocus();
    },
  },
});
</script>

<template>
  <InputWrapperComp
    ref="wrapper"
    :label="label"
    :error="errorText"
    :for="inputId"
    :style="{ width }"
  >
    <div class="input" @keypress="(e) => $emit('keypress', e)">
      <IconComp
        v-if="leftIcon"
        class="input--left-icon"
        :name="leftIcon"
        color="tertiary"
      />

      <input
        :id="inputId"
        ref="input"
        v-model="value"
        class="input__field"
        :class="[
          `input__field--size-${size}`,
          `input__field--appearance-${appearance}`,
        ]"
        :style="{ width }"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :error="error || Boolean(errorText)"
        :max="max"
        :min="min"
        autocomplete="off"
        @input="handleInput"
      />

      <div class="input__buttons">
        <ButtonComp
          v-show="clearButton && modelValue"
          icon="cancel"
          color="neutral"
          :size="size"
          appearance="inline"
          icon-color="tertiary"
          @click="clearInput"
        />

        <TooltipComp :text="$t('reset')" position="top">
          <ButtonComp
            v-show="resetValue && modelValue !== resetValue"
            icon="restart_alt"
            color="neutral"
            :size="size"
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
@import "@/styles/main";

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
    right: 8px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
