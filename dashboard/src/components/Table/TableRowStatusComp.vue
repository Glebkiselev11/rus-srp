<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "TableRowStatusComp",
	props: {
		active: {
			type: Boolean,
			default: false,
		},
	},
});

</script>

<template>
	<tr
		class="table-row-status"
	>
		<div
			class="table-row-status__indicator" 
			:class="{
				'table-row-status__indicator--active': active,
			}"
		/>
		<slot />
	</tr>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.table-row-status {
	width: 12px;
	height: 100%;
	&:hover {
		background: $color-background-content-primary-hovered;
	}

	&__indicator {
		width: 4px;
		height: inherit;

		&--active {
			background-color: $color-background-negative;
		}
	}
}

</style>
