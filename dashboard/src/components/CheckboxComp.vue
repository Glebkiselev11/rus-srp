<script lang="ts">
import { defineComponent } from "vue";
import IconComp from "./IconComp/index.vue";
import type { IconName } from "@/types/icons";

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
		:class="[
			{ 'checkbox--disabled': disabled }, 
			{ 'checkbox--indeterminated': indeterminated }, 
			{ 'checkbox--checked': modelValue }
		]"
	>
		<input
			type="checkbox"
			:checked="modelValue"
			:disabled="disabled"
			@change="toggleChecked"
		>

		<div class="checkbox__fake-input">
			<IconComp 
				:name="iconName"
				color="current-color"
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
		&:focus-visible ~.checkbox__fake-input {
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

