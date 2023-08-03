<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { IconSize } from "../../types/icons";

export default defineComponent({
	name: "SearchIcon",
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
		<g clip-path="url(#clip0_202_1023)">
			<!-- eslint-disable-next-line max-len -->
			<path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
		</g>
		<defs>
			<clipPath id="clip0_202_1023">
				<rect
					width="24"
					height="24"
					fill="white"
				/>
			</clipPath>
		</defs>
	</svg>
</template>