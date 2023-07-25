<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export default defineComponent({
	name: "PanelView",
	components: {
		RouterView,
	},
});
</script>

<template>
	<RouterView />
</template>
