<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { IconSize } from "../../types/icons";

export default defineComponent({
	name: "ArrowDownwardAltIcon",
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
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- eslint-disable-next-line max-len -->
		<path d="M11.975 18L5.95 11.975L7 10.9L11.25 15.075V5.07501H12.75V15.125L16.95 10.925L18 11.975L11.975 18Z" />
	</svg>
</template>