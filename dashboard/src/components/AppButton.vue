<script lang="ts">
import type { IconColor, IconName, IconSize } from "@/types/icons";
import IconComp from "@/components/IconComp/index.vue";
import { defineComponent, type PropType } from "vue";
import type { ButtonColor, ButtonSize, ButtonAppearance } from "@/types/buttons";

export default defineComponent({
	name: "AppButton",
	components: {
		IconComp,
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
		appearance: {
			type: String as PropType<ButtonAppearance>,
			default: "primary",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		iconColor: {
			type: String as PropType<IconColor>,
			default: null,
		},
		pressed: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		_iconColor(): IconColor {
			if (this.iconColor) {
				return this.iconColor;
			}

			if (this.color === "neutral") {
				return "primary";
			}

			if (this.appearance === "primary") {
				return "contrast";
			}

			return this.color;	
		},
		_iconSize(): IconSize {
			if (this.size === "regular") {
				return "regular";
			} else {
				return "compact";
			}
		},
	},
});
</script>

<template>
	<button
		class="app-button" 
		:class="[
			`app-button--size-${size}`, 
			`app-button--appearance-${appearance}`, 
			`app-button--color-${color}`,
			{ 'app-button--icon-and-label' : icon && label},
			{ 'app-button--only-icon' : icon && !label},
			{ 'app-button--only-label': label && !icon},
			{ 'app-button--pressed': pressed }
		]"
		:disabled="disabled"
	>
		<IconComp 
			v-if="icon"
			:name="icon"
			:color="_iconColor"
			:size="_iconSize"
		/>
		<template v-if="label">
			{{ label }}
		</template>
	</button>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	border: none;
	cursor: pointer;
	border-radius: 8px;
	@extend .text-subtitle-2;

	/* Paggings for Icon and label case */
	&--icon-and-label {
		padding-inline-start: 12px;
		padding-inline-end: 16px;

		&.app-button--size-regular {
			padding-block: 8px;
		}
		&.app-button--size-compact {
			padding-block: 6px;
		}
		&.app-button--size-small {
			padding-block: 2px;
		}
	}

	/* Paddings for Only icon case */
	&--only-icon {
		&.app-button--size-regular {
			padding: 8px;
		}
		&.app-button--size-compact {
			padding: 6px;
		}
		&.app-button--size-small {
			padding: 2px;
		}
	}

	/* Paddings for Only label case */
	&--only-label {
		padding-inline: 16px;
		&.app-button--size-regular {
			padding-block: 10px;
		}
		&.app-button--size-compact {
			padding-block: 6px;
		}
		&.app-button--size-small {
			padding-block: 2px;
		}
	}

	&--size {
		&-regular {
			min-block-size: 40px;
			min-inline-size: 40px;
		}
		&-compact {
			min-block-size: 32px;
			min-inline-size: 32px;
		}
		&-small {
			min-block-size: 24px;
			min-inline-size: 24px;
		}
	}

	&--appearance {
		&-primary {
			&.app-button--color-accent-primary {
				background-color: $color-text-accent-primary;
				color: $color-text-contrast;
			}

			&.app-button--color-accent-secondary {
				background-color: $color-text-accent-secondary;
				color: $color-text-contrast;
			}

			&.app-button--color-negative {
				background-color: $color-background-negative;
				color: $color-text-contrast;
			}

			&.app-button--color-neutral {
				background-color: $color-background-content-secondary;
				color: $color-text-primary;
			}
		}

		&-secondary {
			background-color: $color-background-content-tertiary;
			&.app-button--color-accent-primary {
				color: $color-text-accent-primary;
			}

			&.app-button--color-accent-secondary {
				color: $color-text-accent-secondary;
			}

			&.app-button--color-negative {
				color: $color-text-negative;
			}

			&.app-button--color-neutral {
				color: $color-text-primary;
			}

		}

		&-inline {
			background: none;
			&.app-button--color-accent-primary {
				color: $color-text-accent-primary;
			}

			&.app-button--color-accent-secondary {
				color: $color-text-accent-secondary;
			}

			&.app-button--color-negative {
				color: $color-text-negative;
			}

			&.app-button--color-neutral {
				color: $color-text-primary;
			}
		}
	}

	&:hover {
		&.app-button--appearance-primary {
			&.app-button--color-accent-primary {
				background-color: $color-background-accent-primary-hovered;
			}

			&.app-button--color-accent-secondary {
				background-color: $color-background-accent-secondary-hovered;
			}

			&.app-button--color-negative {
				background-color: $color-background-negative-hovered;
			}

			&.app-button--color-neutral {
				background-color: $color-background-secondary-hovered;
			}
		}

		&.app-button--appearance-secondary {
			background-color: $color-background-tertiary-hovered;
		}

		&.app-button--appearance-inline {
			background-color: $color-background-content-primary-hovered;
		}

	}

	&--pressed {
		&.app-button--appearance-primary {
			&.app-button--color-accent-primary {
				background-color: $color-background-accent-primary-active;
			}

			&.app-button--color-accent-secondary {
				background-color: $color-background-accent-secondary-active;
			}

			&.app-button--color-negative {
				background-color: $color-background-negative-active;
			}

			&.app-button--color-neutral {
				background-color: $color-background-secondary-active;
			}
		}

		&.app-button--appearance-secondary {
			background-color: $color-background-tertiary-active;
		}

		&.app-button--appearance-inline {
			background-color: $color-background-content-primary-active;
		}
	}

	&:active {
		@extend .app-button--pressed;
	}

	&:disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}
</style>
