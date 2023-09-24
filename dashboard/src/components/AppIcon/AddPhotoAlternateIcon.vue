<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AddPhotoAlternateIcon",
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
		<path d="M3.75 17.5C3.40625 17.5 3.11198 17.3776 2.86719 17.1328C2.6224 16.888 2.5 16.5937 2.5 16.25V3.75C2.5 3.40625 2.6224 3.11198 2.86719 2.86719C3.11198 2.6224 3.40625 2.5 3.75 2.5H12.2708V3.75H3.75V16.25H16.25V7.75H17.5V16.25C17.5 16.5937 17.3776 16.888 17.1328 17.1328C16.888 17.3776 16.5937 17.5 16.25 17.5H3.75ZM14.5833 7.125V5.4375H12.8958V4.1875H14.5833V2.5H15.8333V4.1875H17.5208V5.4375H15.8333V7.125H14.5833ZM5 14.125H15L12 10.125L9.35417 13.6042L7.39583 11.0208L5 14.125Z" />
	</svg>
</template>
