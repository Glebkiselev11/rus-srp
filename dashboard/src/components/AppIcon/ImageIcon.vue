<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "ImageIcon",
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
		<path d="M3.75 17.5C3.41667 17.5 3.125 17.375 2.875 17.125C2.625 16.875 2.5 16.5833 2.5 16.25V3.75C2.5 3.41667 2.625 3.125 2.875 2.875C3.125 2.625 3.41667 2.5 3.75 2.5H16.25C16.5833 2.5 16.875 2.625 17.125 2.875C17.375 3.125 17.5 3.41667 17.5 3.75V16.25C17.5 16.5833 17.375 16.875 17.125 17.125C16.875 17.375 16.5833 17.5 16.25 17.5H3.75ZM4.91667 14.2292H15.1042L12.0417 10.1458L9.29167 13.7083L7.35417 11.0625L4.91667 14.2292Z" />
	</svg>
</template>