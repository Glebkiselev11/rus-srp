<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "NavigateBeforeIcon",
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
		<path d="M11.6875 15L6.66663 9.97915L11.6875 4.95831L12.5833 5.85415L8.45829 9.97915L12.5833 14.1041L11.6875 15Z" />
	</svg>
</template>