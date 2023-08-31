<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "NavigateNextIcon",
	props: {
		size: {
			type: String,
			required: true,
		},
	},
});
</script>

<template>
	<svg
		:width="size"
		viewBox="0 0 20 20"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- eslint-disable-next-line max-len -->
		<path d="M7.81246 15L6.91663 14.1041L11.0416 9.97915L6.91663 5.85415L7.81246 4.95831L12.8333 9.97915L7.81246 15Z" />
	</svg>
</template>