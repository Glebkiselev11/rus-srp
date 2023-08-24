<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "FilterHdrIcon",
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
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- eslint-disable-next-line max-len -->
		<path d="M0.833313 15L5.83331 8.33333L9.89581 13.75H11.4583L8.27081 9.52083L11.6666 5L19.1666 15H0.833313Z" />
	</svg>
</template>