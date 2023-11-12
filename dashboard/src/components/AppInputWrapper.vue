<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppInputWrapper",
	props: {
		label: {
			type: String,
			default: null,
		},
		error: {
			type: String,
			default: null,
		},
		for: {
			type: String,
			required: true,
		},
	},
	methods: {
		selectInput() {
			const target = this.$refs.target as HTMLElement;
			const element = target.querySelector(`#${this.for}`) as HTMLElement;

			if (element) {
				element.tagName === "BUTTON" ? element.click() : element.focus();
			}
		},
	},

});

</script>

<template>
	<div class="app-input-wrapper">
		<label
			v-if="label"
			class="app-input-wrapper__label"
			@click="selectInput"
		>
			{{ label }}
		</label>

		<div ref="target">
			<slot />
		</div>

		<span
			v-if="error"
			class="app-input-wrapper__error"
		>
			{{ error }}
		</span>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";
.app-input-wrapper {
	display: flex;
	flex-direction: column;
	row-gap: 8px;

	&__label {
		@extend .text-body-2;
		&::first-letter {
			text-transform: uppercase;
		}
	}

	&__error {
		@extend .text-caption-2;
		color: $color-text-negative;
	}
}

</style>
