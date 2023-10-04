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
	<div class="app-navbar-item">
		<AppIcon
			:name="iconName"
			:color="active ? 'accent-primary' : 'primary'"
		/>

		<span 
			v-if="showLabels"
			class="app-navbar-item--label"
			:class="{ 'app-navbar-item--label-active': active }"
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
	padding: 12px 20px;

	&:hover {
		cursor: pointer;
	}

	&--label {
		@extend .text-body-2;
		color: $color-text-primary;

		&-active {
			color: $color-text-accent-primary;
		}
	}
}

</style>
