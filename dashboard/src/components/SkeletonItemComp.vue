<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "SkeletonItemComp",
});

</script>

<template>
	<div class="skeleton-item" />
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.skeleton-item {
	width: 100%;
	height: 100%;
	background: 
		linear-gradient(
			to right, 
			$color-background-content-tertiary, 
			$color-background-content-secondary, 
			$color-background-content-tertiary
		);
	background-size: 200% 100%;
	animation: gradientShift 2s linear infinite;
}

@keyframes gradientShift {
	0% {
		background-position: -100% 50%;
	}
	50% {
		background-position: 50% 100%;
	}
	100% {
		background-position: -100% 50%;
	}
}

</style>
