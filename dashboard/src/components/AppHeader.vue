<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppHeader",
	props: {
		title: {
			type: String,
			default: null,
		},
	},
});
</script>

<template>
	<header class="app-header">
		<h3>{{ title }}</h3>
	</header>
</template>

<style lang="scss" scoped>

.app-header {
  width: 100%;
  min-height: 48px;
  padding-inline: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>