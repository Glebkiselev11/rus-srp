<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "SwitchComp",
	props: {
		modelValue: {
			type: Boolean,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["update:modelValue"],
	methods: {
		toggleChecked() {
			this.$emit("update:modelValue", !this.modelValue);	
		},
	},
});

</script>

<template>
	<label 
		class="switch"
		:class="[
			{ 'switch--disabled': disabled }, 
			{ 'switch--checked': modelValue }
		]"
	>
		<input
			type="checkbox"
			:checked="modelValue"
			:disabled="disabled"
			@change="toggleChecked"
		>
		<span
			class="switch__slider"
		/>
	</label>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.switch {
  position: relative;
  width: 36px;
  height: 20px;

  input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;

    &:focus-visible ~.switch__slider {
      @include focus-visible;
    }
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    width: inherit;
    height: inherit;
    border-radius: 50px;
    transition: background-color .2s;
    background: $color-background-content-secondary;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      border-radius: 50%;
      left: 2px;
      bottom: 2px;
      transition: .2s;
      background-color: $color-icon-contrast;
      filter: 
        drop-shadow(0px 0px 4px rgba(2, 18, 38, 0.08)) 
        drop-shadow(0px 4px 8px rgba(2, 18, 38, 0.04));
    }

    &:hover {
      background-color: $color-background-secondary-hovered;
    }
  }

  &--checked {
    .switch__slider {
      background-color: $color-background-accent-primary;
    }

    .switch__slider:before {
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

    .switch__slider:before {
      background-color: $color-field-background;
    }
  }
}

</style>
