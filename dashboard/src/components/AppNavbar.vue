<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppNavbarItem from "./AppNavbarItem.vue";
import type { NavItem } from "../types";

export default defineComponent({
	name: "AppNavbar",
	components: {
		AppNavbarItem,
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
		class="app-navbar"
		:class="{ 'app-navbar--expanded': isExpanded}"
	>
		<AppNavbarItem
			v-for="item in items"
			:key="item.name"
			:label="item.label"
			:active="item.active"
			:icon-name="item.icon"
			:show-labels="isExpanded"
			@click="handleClick(item)"
		/>
	</aside>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-navbar {
	margin-block-start: 10px;
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
