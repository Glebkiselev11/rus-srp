<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppIcon from "@/components/AppIcon/index.vue";
import type { IconName } from "../types/icons";

export default defineComponent({
	name: "AppNavbarItem",
	components: {
		AppIcon,
	},
	props: {
		active: {
			type: Boolean,
			required: true,
		},
		iconName: {
			type: String as PropType<IconName>,
			required: true,
		},
		label: {
			type: String,
			default: "",
		},
		showLabels: {
			type: Boolean,
			default: false,
		},
	},
});

</script>

<template>
	<div
		class="app-navbar-item"
		:class="{'app-navbar-item--active': active}"
	>
		<AppIcon
			:name="iconName"
			:color="active ? 'accent-primary' : 'primary'"
		/>

		<span 
			v-if="showLabels"
			class="app-navbar-item__label"
			:class="{ 'app-navbar-item__label--active': active }"
		>
			{{ label }}
		</span>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-navbar-item {
	display: flex;	
	align-items: center;
	column-gap: 12px;
	min-block-size: 48px;
	min-inline-size: 48px;
	padding: 12px;
	border-radius: 12px;
	cursor: pointer;

	&:hover {
		background-color: $color-background-content-primary-hovered;
	}

	&--active {
		background-color: $color-background-accent-primary-tint;
		&:hover {
			cursor: default;
			@extend .app-navbar-item--active;
		}
	}

	&__label {
		@extend .text-body-2;
		color: $color-text-primary;

		&--active {
			color: $color-text-accent-primary;
		}
	}
}

</style>
