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
		selected: {
			type: Boolean,
			default: false,
		},
		paddingInline: {
			type: String,
			default: "16px",
		},
	},
});

</script>

<template>
	<div 
		class="app-list-item"
		:class="{
			'app-list-item--clickable': clickable,
			'app-list-item--selected': selected,
			'app-list-item--compact': size === 'compact',
		}"
		:style="{
			paddingInline,
		}"
	>
		<slot />
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-list-item {
	padding-block: 12px;
	border-radius: 12px;
	display: flex;
	align-items: center;
	column-gap: 16px;
	white-space: nowrap;
	text-overflow: ellipsis;

	&--clickable {
		cursor: pointer;

		&:hover {
			background-color: $color-background-content-primary-hovered;
		}
	}

	&--selected {
		cursor: default;
		background-color: $color-background-content-primary-active;

		&:hover {
			@extend .app-list-item--selected;
		}
	}

	&--compact {
		padding-block: 8px;
	}
}
</style>
