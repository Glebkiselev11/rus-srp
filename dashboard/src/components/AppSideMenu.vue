

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppIcon from "@/components/AppIcon/index.vue";
import AppNavbarItem from "./AppNavbarItem.vue";
import type { NavItem } from "../types";


export default defineComponent({
	name: "AppSideMenu",
	components: {
		AppIcon,
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
		return {};
	},
	methods: {
		handleClick(item: NavItem) {
			this.$emit("clickOnItem", item);
		},
	},
});
</script>


<template>
	<aside class="app-side-menu">
		<div class="app-side-menu--header">
			<AppIcon
				name="admin_panel_settings"
			/>
			<div>
				<h3 class="title">
					Srpski rec
				</h3>
				<span class="description">Admin</span>
			</div>
		</div>

		<nav>
			<AppNavbarItem 
				v-for="item in items"
				:key="item.name"
				:label="item.label"
				:active="item.active"
				:icon-name="item.icon"
				@click="handleClick(item)"
			/>
		</nav>
	</aside>
</template>


<style scoped lang="scss">
@import "@/styles/main.scss";

.app-side-menu {
  width: 256px;
  height: 100%;
	border-inline-end: 1px solid $color-separator-primary;

	&--header {
		display: flex;
		gap: 12px;
		align-items: center;
		padding: 12px 20px;

		.title {
			color: $color-text-primary;
		}
		.description {
			@extend .text-body-2;
			color: $color-text-secondary;
		}
	}
}

</style>