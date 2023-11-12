<script lang="ts">
import type { IconName } from "@/types/icons";
import IconComp from "./IconComp/index.vue";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "ZeroStateComp",
	components: {
		IconComp,
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
	<div class="zero-state">
		<div class="zero-state__container">
			<IconComp
				v-if="icon"
				:name="icon"
			/>

			<h4 v-if="title">
				{{ title }}
			</h4>

			<span
				v-if="description"
				class="zero-state__description"
			>
				{{ description }}
			</span>

			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.zero-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	&__container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 16px;
		max-width: 280px;
	}

	&__description {
		@extend .text-color-secondary, .text-body-2;
	}
}

</style>
