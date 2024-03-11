<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "SkeletonItemComp",
	props: {
		width: {
			type: String,
			default: "100%",
		},
		height: {
			type: String,
			default: "100%",
		},
		randomWidth: {
			type: Boolean,
			default: false,
		},
		borderRadius: {
			type: String,
			default: "0",
		},
	},
	computed: {
		_width(): string {
			if (!this.randomWidth) {
				return this.width;
			}

			const randomWidth = Math.random() * 100;
			return randomWidth < 50 ? `${randomWidth + 50}%` : `${randomWidth}%`;
		},
	},

});

</script>

<template>
	<div
		class="skeleton-item"
		:style="{
			width: _width,
			height: height,
			borderRadius,
		}"
	/>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.skeleton-item {
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
