<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppInputWrapper from "./AppInputWrapper.vue";
import AppDropdownMenu from "./AppDropdownMenu.vue";
import AppIcon from "./AppIcon/index.vue";
import type { SelectSize, SelectType } from "@/types/select";
import type { IconName } from "@/types/icons";

export default defineComponent({
	name: "AppSelect",
	components: {
		AppInputWrapper,
		AppDropdownMenu,
		AppIcon,
	},
	props: {
		type: {
			type: String as PropType<SelectType>,
			default: "default",
		},
		size: {
			type: String as PropType<SelectSize>,
			default: "regular",
		},
		label: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		modelValue: {
			type: [String, Number],
			default: null,
		},
		options: {
			type: Array as PropType<{ value: string | number; label: string }[]>,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		icon: {
			type: String as PropType<IconName>,
			default: null,
		},
	},
	emits: ["update:modelValue"],
	computed: {
		items() {
			return this.options.map((item) => ({
				...item,
				handler: () => {
					this.$emit("update:modelValue", item.value);
				},
			}));
		},
		selectedItem() {
			const item = this.options.find((item) => item.value === this.modelValue);
			return item ? item.label : this.placeholder;
		},
	},
	methods: {
		handleSelect(event: Event) {
			const target = event.target as HTMLSelectElement;
			this.$emit("update:modelValue", target.value);
		},
	},
});
</script>

<template>
	<AppInputWrapper
		v-slot="wrapper"
		:label="label"
	>
		<AppDropdownMenu
			v-slot="{isMenuOpen}"
			:items="items"
			:disabled="disabled"
		>
			<button 
				:id="wrapper.id"
				class="app-select"
				:disabled="disabled"
				:class="[
					`app-select--type-${type}`,
					`app-select--size-${size}`,
					{ 'app-select--menu-open': isMenuOpen },
					{ 'app-select--with-icon': icon }
				]"
			>
				<AppIcon
					v-if="icon"
					:name="icon"
					size="compact"
					color="secondary"
				/>

				{{ selectedItem }}

				<AppIcon
					:name="isMenuOpen ? 'expand_more_up' : 'expand_more_down'"
					size="compact"
					color="tertiary"
				/>
			</button>
		</AppDropdownMenu>
	</AppInputWrapper>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-select {
	border-radius: 8px;
	padding-block: 0px;
	cursor: pointer;
	display: flex;
	align-items: center;

	&--type {
		&-default {
			border: 1px solid $color-separator-primary; 
		}

		&-inline {
			background: transparent;
		}

		&-inline, &-filled {
			border: none;
		}

		&-filled {
			background: $color-background-content-tertiary;
		}

	}

	&--size {
		&-regular {
			height: 40px;
			padding-inline: 16px;
			column-gap: 8px;
		}

		&-compact {
			height: 32px;
			column-gap: 6px;
			padding-inline: 8px;
		}
	}

	&--with-icon {
		&.app-select--size-regular {
			padding-inline: 8px;
			column-gap: 8px;
		}

		&.app-select--size-compact {
			padding-inline: 6px;
		}
	}

	&:hover {
		&.app-select--type-default, &.app-select--type-inline {
			background-color: $color-background-content-primary-hovered;
		}
		&.app-select--type-filled {
			background-color: $color-background-tertiary-hovered;
		}
	}

	&:active, &.app-select--menu-open {
		&.app-select--type-default, &.app-select--type-inline {
			background-color: $color-background-content-primary-active;
		}
		&.app-select--type-filled {
			background-color: $color-background-tertiary-active;
		}
	}

	&:disabled {
		opacity: 0.5;
		pointer-events: none;
	}

}

</style>