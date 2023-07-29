<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppInput",
	props: {
		type: {
			type: String,
			default: "text",
		},
		modelValue: {
			type: String,
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
	},
	emits: ["update:modelValue"],
	methods: {
		emitValue(event: Event) {
			const target = event.target as HTMLInputElement;
			this.$emit("update:modelValue", target.value);
		},
	},
});

</script>

<template>
	<input
		class="app-input"
		:type="type"
		:value="modelValue"
		:placeholder="placeholder"
		:disabled="disabled"
		:warning="error"
		@input="emitValue"
	>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-input {
	border-radius: 8px;
	height: 40px;
	min-width: 280px;
	border: 1px solid $color-separator-primary;
	background: $color-field-background;
	padding: 0 16px;

	&::placeholder {
		@extend .text-body-1;
		color: $color-text-tertiary;
	}

	&:focus {
		outline: 1px solid $color-stroke-accent;
	}

	&:disabled {
		&::placeholder {
			color: $color-text-disabled;
		}
	}

	&[warning="true"] {
		outline: 1px solid $color-stroke-negative;
	}
}

</style>