<script lang="ts">
import type { IconName } from "@/types/icons";
import AppIcon from "./AppIcon/index.vue";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "AppZeroState",
	components: {
		AppIcon,
	},
	props: {
		icon: {
			type: String as PropType<IconName>,
			default: null,
		},
		title: {
			type: String,
			default: null,
		},
		description: {
			type: String,
			default: null,
		},
	},
});

</script>

<template>
	<div class="app-zero-state">
		<div class="app-zero-state--container">
			<AppIcon
				v-if="icon"
				:name="icon"
			/>

			<h4 v-if="title">
				{{ title }}
			</h4>

			<span
				v-if="description"
				class="app-zero-state--description"
			>
				{{ description }}
			</span>

			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-zero-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	&--container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		width: 280px;
	}

	&--description {
		@extend .text-color-secondary, .text-body-2;
	}
}

</style>