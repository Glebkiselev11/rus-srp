<script lang="ts">
import { defineComponent } from "vue";
import AppSideMenu from "@/components/AppSideMenu.vue";
import { RouterView } from "vue-router";

export default defineComponent({
	name: "PanelView",
	components: {
		RouterView,
		AppSideMenu,
	},
});
</script>

<template>
	<div class="panel-view">
		<AppSideMenu :items="['first', 'second']" />
		<RouterView />
	</div>
</template>

<style scoped lang="scss">
.panel-view {
	display: flex;
	width: 100%;
	height: 100vh;
	background: yellow;
}

</style>

