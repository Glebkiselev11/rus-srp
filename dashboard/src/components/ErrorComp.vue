<script lang="ts">

import { defineComponent, type PropType } from "vue";
import type { IconSize } from "@/types/icons";
import IconComp from "@/components/IconComp/index.vue";

type ErrorSize = IconSize

export default defineComponent({
	name: "ErrorComp",
	components: {
		IconComp,
	},
	props: {
		text: {
			type: String,
			required: true,
		},
		size: {
			type: String as PropType<ErrorSize>,
			default: "compact",
		},
	},
});

</script>

<template>
	<span class="error">
		<IconComp 
			color="negative"
			name="error"
			:size="size"
		/>

		<span
			class="error__text"
			:class="[`error__text--${size}`]"
			v-text="text"
		/>
	</span>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.error {
	display: flex;
	align-items: center;

	&__text {
		margin-inline-start: 8px;
		color: $color-text-negative;

		&--small {
			@include text-caption-2;
		}

		&--compact {
			@include text-body-2;
		}

		&--regular {
			@include text-body-1;
		}
	}
}

</style>
