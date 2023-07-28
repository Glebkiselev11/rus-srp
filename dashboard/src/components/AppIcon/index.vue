<script lang="ts">
import { defineComponent, type PropType, type Component } from "vue";
import AdminPanelSettings from "./AdminPanelSettingsIcon.vue";
import type { IconColor, IconName, IconSize } from "./types";


export default defineComponent({
	name: "AppIcon",
	props: {
		name: {
			type: String as PropType<IconName>,
			required: true,
		},
		size: {
			type: String as PropType<IconSize>,
			default: "24px",
		},
		color: {
			type: String as PropType<IconColor>,
			default: "primary",
		},
	},
	computed: {
		icon(): Component {
			return {
				"admin_panel_settings": AdminPanelSettings,
			}[this.name];
		},
	},
},
);

</script>

<template>
	<component
		:is="icon"
		:class="[`app-icon--${color}`]"
		:size="size"
		:color="color"
	/>
</template>


<style lang="scss">
@import "@/styles/colors.scss";

.app-icon {

	&--primary {
		fill: $color-icon-primary;
	}

	&--secondary {
		fill: $color-icon-secondary;
	}

	&--tertiary {
		fill: $color-icon-tertiary;
	}

	&--contrast {
		fill: $color-icon-contrast;
	}

	&--accent-primary {
		fill: $color-icon-accent-primary;
	}

	&--accent-secondary {
		fill: $color-icon-accent-secondary;
	}

	&--positive {
		fill: $color-icon-positive;
	}

	&--negative {
		fill: $color-icon-negative;
	}

	&--warning {
		fill: $color-icon-warning;
	}

	&--link {
		fill: $color-icon-link;
	}
}


</style>