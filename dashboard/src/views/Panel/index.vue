<script lang="ts">
import { defineComponent } from "vue";
import AppSideMenu from "@/components/AppSideMenu.vue";
import { RouterView } from "vue-router";
import type { NavItem } from "../../types";

export default defineComponent({
	name: "PanelView",
	components: {
		RouterView,
		AppSideMenu,
	},
	data() {
		return {
		};
	},
	computed: {
		panelPages(): NavItem[] {
			return [
				{
					label: this.$t("all-words"),
					name: "words",
					icon: "list" as const,
					active: false,
				},
				{
					label: this.$t("settings"),
					name: "settings",
					icon: "settings" as const,
					active: false,
				},
			].map((x: NavItem) => ({
				...x,
				active: x.name === this.$route.name,
			}));
		},
	},
	methods: {
		changePage(item: NavItem) {
			this.$router.push({ name: item.name });
		},
	},
});
</script>

<template>
	<div class="panel-view">
		<AppSideMenu
			:items="panelPages"
			@click-on-item="changePage"
		/>
		<RouterView />
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.panel-view {
	display: flex;
	width: 100%;
	height: 100vh;
	background-color: $color-background;
}
</style>

