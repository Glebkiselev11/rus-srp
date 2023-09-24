<script lang="ts">
import { debounce } from "lodash";
import { type PropType, defineComponent } from "vue";
import type { IconName } from "../types/icons";
import AppIcon from "./AppIcon/index.vue";
import AppButton from "./AppButton.vue";

type InputSize = "regular" | "compact";

export default defineComponent({
	name: "AppInput",
	components: {
		AppIcon,
		AppButton,
	},
	props: {
		type: {
			type: String,
			default: "text",
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
			default: "280px",
		},
		size: {
			type: String as PropType<InputSize>,
			default: "regular",
		},
		clearButton: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["update:modelValue"],
	methods: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		debounceEmit: debounce(function(this: any, value: unknown) {
			this.emitValue(value);
		}, 500),
		emitValue(value: unknown) {
			this.$emit("update:modelValue", value);
		},
		handleInput(event: Event) {
			const value = (event.target as HTMLInputElement).value;

			if (
				this.max && Number(value) > this.max || 
				this.min && Number(value) < this.min
			) {
				return;
			}

			this.debounce ? this.debounceEmit(value) : this.emitValue(value);
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
			color="tertiary"
		/>

		<input
			class="app-input--input"
			:class="['app-input--input--' + size]"
			:style="{ width }"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:warning="error"
			:max="max"
			:min="min"
			@input="handleInput"
		>

		<AppButton
			v-if="clearButton && modelValue"
			icon="cancel"
			color="neutral"
			size="compact"
			type="inline"
			icon-color="tertiary"
			class="app-input--clear-button"
			@click="emitValue('')"
		/>
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
		border: 1px solid $color-separator-primary;
		background: $color-field-background;
		padding: 0 8px;

		&--regular {
			@extend .text-body-1;
			height: 40px;
		}

		&--compact {
			@extend .text-body-2;
			height: 32px;
		}

		&:has(.app-input--left-icon) {
			padding-left: 48px;
		}

		&::placeholder {
			@extend .text-body-1;
			color: $color-text-tertiary;
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

	&--clear-button {
		position: absolute;
		right: 8px;
		top: 4px;
	}
}

</style>