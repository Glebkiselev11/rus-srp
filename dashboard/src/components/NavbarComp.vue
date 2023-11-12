<script lang="ts">
import { defineComponent, type PropType } from "vue";
import NavbarItemComp from "./NavbarItemComp.vue";
import type { NavItem } from "../types";
import AppTooltip from "./AppTooltip.vue";

export default defineComponent({
	name: "NavbarComp",
	components: {
		NavbarItemComp,
		AppTooltip,
	},
	props: {
		items: {
			type: Array as PropType<NavItem[]>,
			required: true,
		},
	},
	emits: ["clickOnItem"],
	data() {
		return {
			isExpanded: false,
		};
	},
	methods: {
		handleClick(item: NavItem) {
			this.$emit("clickOnItem", item);
		},
	},
});
</script>

<template>
	<aside
		class="navbar"
		:class="{ 'navbar--expanded': isExpanded}"
	>
		<AppTooltip
			v-for="item in items"
			:key="item.name"
			:text="$t(item.name)"
			position="right"
		>
			<NavbarItemComp
				:label="item.label"
				:active="item.active"
				:icon-name="item.icon"
				:show-labels="isExpanded"
				@click="handleClick(item)"
			/>
		</AppTooltip>
	</aside>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.navbar {
	padding-block-start: 10px;
	width: 72px;
	height: 100%;
	background-color: $color-background-content-primary;
	border-inline-end: 1px solid $color-separator-primary;
	display: flex;
	flex-direction: column;
	row-gap: 4px;
	padding-inline: 12px;

	&--expanded {
		width: 256px;
	}
}

</style>
