<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { IconSize } from "../../types/icons";

export default defineComponent({
	name: "ArrowUpwardAltIcon",
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
		<path d="M11.3 17.9V7.89998L7.05 12.075L6 11L12.025 4.97498L18.05 11L17 12.05L12.8 7.84998V17.9H11.3Z" />
	</svg>
</template>