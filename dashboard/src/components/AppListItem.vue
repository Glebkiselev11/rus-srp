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
		<div class="app-list-item--left">
			<slot name="left" />
		</div>		
		<slot name="right" />
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-list-item {
  width: 100%;
  height: 64px;
  padding-inline: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;

  &--left {
    display: flex;
    align-items: center;
    column-gap: 16px;
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      background-color: $color-background-content-primary-hovered;
    }
  }

  &--compact {
    height: 56px;
  }
}
</style>