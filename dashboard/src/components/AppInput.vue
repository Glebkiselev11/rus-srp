<script lang="ts">
import { type PropType, defineComponent } from "vue";
import type { IconName } from "../types/icons";

import AppIcon from "./AppIcon/index.vue";

export default defineComponent({
	name: "AppInput",
	components: {
		AppIcon,
	},
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
		leftIcon: {
			type: String as PropType<IconName>,
			default: null,
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
	<div class="app-input">
		<AppIcon
			v-if="leftIcon"
			class="app-input--left-icon"
			:name="leftIcon"
			size="24px"
			color="tertiary"
		/>

		<input
			class="app-input--input"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:warning="error"
			@input="emitValue"
		>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-input {
	position: relative;

	&:has(.app-input--left-icon) .app-input--input {
		padding-left: 40px;
	}

	&--left-icon {
		position: absolute;
		top: 50%;
		left: 8px;
		transform: translateY(-50%);
	}

	&--input {
		border-radius: 8px;
		height: 40px;
		min-width: 280px;
		border: 1px solid $color-separator-primary;
		background: $color-field-background;
		padding: 0 8px;

		&:has(.app-input--left-icon) {
			padding-left: 48px;
		}

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
}

</style>