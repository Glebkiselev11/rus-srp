<script lang="ts">
import { debounce } from "lodash";
import { type PropType, defineComponent, watch } from "vue";
import type { IconName } from "../types/icons";
import IconComp from "./IconComp/index.vue";
import ButtonComp from "./ButtonComp.vue";
import InputWrapperComp from "./InputWrapperComp.vue";
import AppTooltip from "./AppTooltip.vue";
import type { InputSize, InputAppearance } from "@/types/input";
import { useFocusWithin } from "@vueuse/core";

export default defineComponent({
	name: "InputComp",
	components: {
		IconComp,
		ButtonComp,
		InputWrapperComp,
		AppTooltip,
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
		// If provided - show reset button 
		resetValue: {
			type: [String, Number],
			default: undefined,
		},
	},
	emits: ["update:modelValue"],
	data() {
		return {
			focusOnInput: false,
		};
	},
	computed: {
		errorLabel() {
			return this.disableErrorLabel ? undefined : this.error;
		},
	},
	mounted() {
		if (this.focusOnMount) {
			this.setFocus();
		}

		this.initWatchingFocus();
	},
	methods: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		debounceEmit: debounce(function(this: any, value: unknown) {
			this.emitValue(value);
		}, 500),

		initWatchingFocus() {
			const wrapper = this.$refs.wrapper as HTMLElement;
			const { focused } = useFocusWithin(wrapper);
			watch(focused, focused => {
				this.focusOnInput = focused;
			});
		},

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
		:error="errorLabel"
		for="input"
	>
		<div
			class="input"
		>
			<IconComp
				v-if="leftIcon"
				class="input--left-icon"
				:name="leftIcon"
				color="tertiary"
			/>

			<input
				id="input"
				ref="input"
				class="input__field"
				:class="[
					`input__field--size-${size}`,
					`input__field--appearance-${appearance}`
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

			<div class="input__buttons">
				<ButtonComp
					v-show="clearButton && modelValue && focusOnInput"
					icon="cancel"
					color="neutral"
					:size="size"
					appearance="inline"
					icon-color="tertiary"
					@click="clearInput"
				/>

				<AppTooltip
					:text="$t('reset')"
					position="top"
				>
					<ButtonComp 
						v-show="resetValue && modelValue !== resetValue"
						icon="restart_alt"
						color="neutral"
						:size="size"
						appearance="inline"
						icon-color="tertiary"
						@click="resetInput"
					/>
				</AppTooltip>

				<IconComp 
					v-show="error !== null"
					color="negative"
					name="error"
					:size="size"
				/>
			</div>
		</div>
	</InputWrapperComp>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

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

		&:has(.input--left-icon) {
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
	}
}

</style>