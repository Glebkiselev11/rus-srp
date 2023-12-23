<script lang="ts">
import { defineComponent, type PropType } from "vue";
import InputWrapperComp from "./InputWrapperComp.vue";
import DropdownMenuComp from "./DropdownMenuComp.vue";
import IconComp from "./IconComp/index.vue";
import type { SelectSize, SelectAppearance } from "@/types/select";
import type { IconName } from "@/types/icons";

export default defineComponent({
	name: "SelectComp",
	components: {
		InputWrapperComp,
		DropdownMenuComp,
		IconComp,
	},
	props: {
		appearance: {
			type: String as PropType<SelectAppearance>,
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
	<InputWrapperComp
		:label="label"
		for="select"
	>
		<DropdownMenuComp
			v-slot="{isMenuOpen}"
			:items="items"
			:disabled="disabled"
		>
			<button 
				id="select"
				class="select"
				:disabled="disabled"
				:class="[
					`select--appearance-${appearance}`,
					`select--size-${size}`,
					{ 'select--menu-open': isMenuOpen },
					{ 'select--with-icon': icon }
				]"
			>
				<IconComp
					v-if="icon"
					:name="icon"
					size="compact"
					color="secondary"
				/>

				{{ selectedItem }}

				<IconComp
					:name="isMenuOpen ? 'expand_more_up' : 'expand_more_down'"
					size="compact"
					color="tertiary"
				/>
			</button>
		</DropdownMenuComp>
	</InputWrapperComp>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.select {
	border-radius: 8px;
	padding-block: 0px;
	cursor: pointer;
	display: flex;
	align-items: center;

	&--appearance {
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
			@include text-body-1;
			height: 40px;
			padding-inline: 16px;
			column-gap: 8px;
		}

		&-compact {
			@include text-body-2;
			height: 32px;
			column-gap: 6px;
			padding-inline: 8px;
		}
	}

	&--with-icon {
		&.select--size-regular {
			padding-inline: 8px;
			column-gap: 8px;
		}

		&.select--size-compact {
			padding-inline: 6px;
		}
	}

	&:hover {
		&.select--appearance-default, &.select--appearance-inline {
			background-color: $color-background-content-primary-hovered;
		}
		&.select--appearance-filled {
			background-color: $color-background-tertiary-hovered;
		}
	}

	&:active, &.select--menu-open {
		&.select--appearance-default, &.select--appearance-inline {
			background-color: $color-background-content-primary-active;
		}
		&.select--appearance-filled {
			background-color: $color-background-tertiary-active;
		}
	}

	&:disabled {
		opacity: 0.5;
		pointer-events: none;
	}
}

</style>
