<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "AppInputWrapper",
	props: {
		label: {
			type: String,
			default: null,
		},
	},
	methods: {
		selectInput() {
			const target = this.$refs.target as HTMLElement;
			["input", "textarea", "select", "button"].forEach((tag) => {
				const element = target.querySelector(tag) as HTMLElement;

				if (element) {
					tag === "button" ? element.click() : element.focus();
				}
			});
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

}

</style>
