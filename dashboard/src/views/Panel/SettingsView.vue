<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "SettingsView",
});

</script>

<template>
	<main class="settings-view">
		settings page
	</main>
</template>


<style scoped lang="scss">
@import "@/styles/colors.scss";
.settings-view {
	background: $color-background;
	width: 100%;
	height: 100%;
}

</style>