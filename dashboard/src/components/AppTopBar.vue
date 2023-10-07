<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppTopBar",
	data() {
		return {};
	},
});

</script>

<template>
	<header
		class="app-top-bar"
	>
		<div>
			<slot name="left" />	
		</div>

		<div>
			<slot name="right" />
		</div>
	</header>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-top-bar{
	width: 100%;
	height: 64px;
	padding: 0 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

</style>
