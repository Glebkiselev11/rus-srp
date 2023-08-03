<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppListItem",
	props: {
		clickable: {
			type: Boolean,
			default: false,
		},
		compact: {
			type: Boolean,
			default: false,
		},
	},
});

</script>


<template>
	<div 
		class="app-list-item"
		:class="{
			'app-list-item--clickable': clickable,
			'app-list-item--compact': compact,
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
  justify-content: space-between;

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