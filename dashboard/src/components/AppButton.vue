<script lang="ts">
import type { IconName } from "@/types/icons";
import AppIcon from "@/components/AppIcon/index.vue";
import { defineComponent, type PropType } from "vue";
import type { ButtonColor, ButtonSize, ButtonType } from "@/types/buttons";

export default defineComponent({
	name: "AppButton",
	components: {
		AppIcon,
	},
	props: {
		label: {
			type: String,
			default: null,
		},
		icon: {
			type: String as PropType<IconName>,
			default: null,
		},
		color: {
			type: String as PropType<ButtonColor>,
			default: "accent-primary",
		},
		size: {
			type: String as PropType<ButtonSize>,
			default: "regular",
		},
		type: {
			type: String as PropType<ButtonType>,
			default: "primary",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<template>
	<button
		class="app-button" 
		:class="[`app-button-size-${size}`, `app-button-type-${type}`, `app-button-color-${color}`]"
		:disabled="disabled"
	>
		<AppIcon 
			v-if="icon"
			:name="icon"
		/>
		<span
			v-if="label"
			class="app-button--label"
			v-text="label"
		/>
	</button>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-button {
	padding: 0;
	padding-inline: 12px;
	border: none;
	cursor: pointer;
	border-radius: 8px;

	&-size {
		&-regular {
			padding-block: 10px;
		}
		&-compact {
			padding-block: 6px;
		}
	}

	&-type {
		&-primary {
			&.app-button-color-accent-primary {
				background-color: $color-text-accent-primary;
				color: $color-text-contrast;
			}

			&.app-button-color-accent-secondary {
				background-color: $color-text-accent-secondary;
				color: $color-text-contrast;
			}

			&.app-button-color-negative {
				background-color: $color-background-negative;
				color: $color-text-contrast;
			}

			&.app-button-color-neutral {
				background-color: $color-background-content-secondary;
				color: $color-text-primary;
			}
		}

		&-secondary {
			background-color: $color-background-content-tertiary;
			&.app-button-color-accent-primary {
				color: $color-text-accent-primary;
			}

			&.app-button-color-accent-secondary {
				color: $color-text-accent-secondary;
			}

			&.app-button-color-negative {
				color: $color-text-negative;
			}

			&.app-button-color-neutral {
				color: $color-text-primary;
			}

		}

		&-inline {
			background: none;
			&.app-button-color-accent-primary {
				color: $color-text-accent-primary;
			}

			&.app-button-color-accent-secondary {
				color: $color-text-accent-secondary;
			}

			&.app-button-color-negative {
				color: $color-text-negative;
			}

			&.app-button-color-neutral {
				color: $color-text-primary;
			}
		}
	}

	&--label {
		@extend .text-subtitle-2
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}
</style>