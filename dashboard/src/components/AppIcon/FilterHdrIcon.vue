<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { IconSize } from "../../types/icons";

export default defineComponent({
	name: "FilterHdrIcon",
	props: {
		size: {
			type: String as PropType<IconSize>,
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