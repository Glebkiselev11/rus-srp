<script lang="ts">
import { debounce } from "lodash";
import { type PropType, defineComponent } from "vue";
import type { IconName } from "../types/icons";
import AppIcon from "./AppIcon/index.vue";
import AppButton from "./AppButton.vue";
import AppInputWrapper from "./AppInputWrapper.vue";
import type { InputSize, InputAppearance } from "@/types/input";

export default defineComponent({
	name: "AppInput",
	components: {
		AppIcon,
		AppButton,
		AppInputWrapper,
	},
	props: {
		label: {
			type: String,
			default: null,
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
			type: String,
			default: null,
		},
		disableErrorLabel: {
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
	},
	emits: ["update:modelValue"],
	computed: {
		errorLabel() {
			return this.disableErrorLabel ? undefined : this.error;
		},
	},
	mounted() {
		if (this.focusOnMount) {
			this.$nextTick(() => {
				const input = this.$refs.input as HTMLInputElement;
				input.focus();
			});
		}
	},
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
	<AppInputWrapper
		:label="label"
		:error="errorLabel"
	>
		<div class="app-input">
			<AppIcon
				v-if="leftIcon"
				class="app-input--left-icon"
				:name="leftIcon"
				color="tertiary"
			/>

			<input
				ref="input"
				class="app-input__field"
				:class="[
					`app-input__field--size-${size}`,
					`app-input__field--appearance-${appearance}`
				]"
				:style="{ width }"
				:type="type"
				:value="modelValue"
				:placeholder="placeholder"
				:disabled="disabled"
				:error="error !== null"
				:max="max"
				:min="min"
				@input="handleInput"
			>

			<div class="app-input__buttons">
				<AppButton
					v-if="clearButton && modelValue"
					icon="cancel"
					color="neutral"
					:size="size"
					appearance="inline"
					icon-color="tertiary"
					class="app-input__clear-button"
					@click="emitValue('')"
				/>

				<AppIcon 
					v-if="error !== null"
					color="negative"
					name="error"
					:size="size"
				/>
			</div>
		</div>
	</AppInputWrapper>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-input {
	position: relative;

	&:has(.app-input--left-icon) .app-input__field {
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
				@extend .text-body-1;
				height: 40px;
			}

			&-compact {
				@extend .text-body-2;
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

		&:has(.app-input--left-icon) {
			padding-left: 48px;
		}

		&:disabled {
			pointer-events: none;
		}

		&::placeholder {
			@extend .text-body-1;
			color: $color-text-tertiary;
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
		column-gap: 8px;
	}
}

</style>
