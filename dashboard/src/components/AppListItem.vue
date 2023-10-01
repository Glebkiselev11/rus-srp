<script lang="ts">
import { defineComponent, type PropType } from "vue";

type Size = "regular" | "compact";

export default defineComponent({
	name: "AppListItem",
	props: {
		clickable: {
			type: Boolean,
			default: false,
		},
		size: {
			type: String as PropType<Size>,
			default: "regular",
		},
	},
});

</script>


<template>
	<div 
		class="app-list-item"
		:class="{
			'app-list-item--clickable': clickable,
			'app-list-item--compact': size === 'compact',
		}"
	>
		<slot />
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-list-item {
	padding-inline: 16px;
	padding-block: 12px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	column-gap: 16px;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;

	&--clickable {
		cursor: pointer;

		&:hover {
			background-color: $color-background-content-primary-hovered;
		}
	}

	&--compact {
		padding-block: 8px;
	}
}
</style>