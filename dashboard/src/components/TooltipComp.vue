<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	name: "TooltipComp",
	props: {
		text: {
			type: String,
			required: true,
		},
		position: {
			type: String as PropType<"top" | "bottom" | "left" | "right">,
			default: "bottom",
		},
	},
	data() {
		return {
			showTooltip: false,
		};
	},
	methods: {
		show() {
			this.showTooltip = true;
		},
		hide() {
			this.showTooltip = false;
		},
	},
});

</script>

<template>
	<div class="tooltip__container">
		<div
			@mouseenter="show"
			@mouseleave="hide"
			@click="hide"
		>
			<slot />
		</div>

		<span
			v-show="showTooltip"
			class="tooltip"
			:class="`tooltip--${position}`"
		>
			{{ text }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.tooltip__container {
  position: relative;
}

.tooltip__triangle {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  rotate: 45deg;
  background: inherit;
  border-radius: 2px;
}

.tooltip {
  @extend .text-caption-2;
  position: absolute;
  z-index: 2;
  background: $color-background-tooltip;
  color: $color-text-contrast;
  border-radius: 8px;
  padding: 8px 12px;
  text-wrap: nowrap;

  &--bottom {
    top: calc(100% + 10px);
    left: 50%;
    translate: -50% 0;
    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--bottom;
      top: -4px;
    }
  }

  &--right {
    top: 50%;
    left: calc(100% + 10px);
    translate: 0 -50%;
    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--right;
      left: -4px;
    }
  }

  &--left {
    top: 50%;
    right: calc(100% + 10px);
    translate: 0 -50%;
    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--left;
      right: -4px;
    }
  }

  &--top {
    bottom: calc(100% + 10px);
    left: 50%;
    translate: -50% 0;
    &::before {
      @extend .tooltip__triangle;
      @extend .tooltip--top;
      bottom: -4px;
    }
  }
}

</style>
