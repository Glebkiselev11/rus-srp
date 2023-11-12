<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "ExpandAllIcon",
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
		<path d="M10 18.3334L5 13.3334L5.91667 12.4167L10 16.5001L14.0833 12.4167L15 13.3334L10 18.3334ZM5.91667 7.58341L5 6.66675L10 1.66675L15 6.66675L14.0833 7.58341L10 3.50008L5.91667 7.58341Z" />
	</svg>
</template>
