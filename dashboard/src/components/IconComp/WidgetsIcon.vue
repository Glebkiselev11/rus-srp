<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "WidgetsIcon",
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
		<path d="M14.1458 10.2917L9.70833 5.85416L14.1458 1.41666L18.5833 5.85416L14.1458 10.2917ZM2.5 8.79166V2.52082H8.77083V8.79166H2.5ZM11.2083 17.5V11.2292H17.4792V17.5H11.2083ZM2.5 17.5V11.2292H8.77083V17.5H2.5ZM3.75 7.54166H7.52083V3.77082H3.75V7.54166ZM14.2083 8.60416L16.8958 5.91666L14.2083 3.22916L11.5208 5.91666L14.2083 8.60416ZM12.4583 16.25H16.2292V12.4792H12.4583V16.25ZM3.75 16.25H7.52083V12.4792H3.75V16.25Z" />
	</svg>
</template>
