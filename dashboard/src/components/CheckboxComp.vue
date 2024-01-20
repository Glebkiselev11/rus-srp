<script lang="ts">
import { defineComponent } from "vue";
import IconComp from "./IconComp/index.vue";
import type { IconColor, IconName } from "@/types/icons";

export default defineComponent({
	name: "CheckboxComp",
	components: {
		IconComp,
	},
	props: {
		modelValue: {
			type: Boolean,
			required: true,
		},
		indeterminated: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["update:modelValue"],
	computed: {
		iconName(): IconName {
			if (this.indeterminated) {
				return "indeterminate_checkbox";
			} else if (this.modelValue) {
				return "checkbox";
			} else {
				return "checkbox_outline_blank";
			}
		},
		iconColor(): IconColor {
			if (this.disabled) {
				return "disabled";
			}
			
			if (this.modelValue || this.indeterminated) {
				return "accent-primary";
			} else {
				return "secondary";
			}
		},
	},
	methods: {
		toggleChecked() {
			this.$emit("update:modelValue", !this.modelValue);	
		},
	},
});

</script>

<template>
	<label 
		class="checkbox"
		:class="{ 'checkbox--disabled': disabled }"
	>
		<input
			type="checkbox"
			:checked="modelValue"
			:disabled="disabled"
			@change="toggleChecked"
		>

		<div
			tabindex="0"
			class="checkbox__fake-input"
		>
			<IconComp 
				:name="iconName"
				:color="iconColor"
			/>
		</div>
	</label>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;

  &:hover {
    cursor: pointer;

		&__fake-input {
			background: $color-background-content-tertiary;
		}
  }

  &--disabled {
    pointer-events: none;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
    display: none;
  }

	&__fake-input {
		width: 24px;
		height: 24px;
		border-radius: 2px;
	}
}

</style>

