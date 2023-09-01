<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
	name: "AppPaginationButton",
	props: {
		label: {
			type: String,
			default: null,
		},
		active: {
			type: Boolean,
			required: true,
		},
	},
	emits: ["click"],
	methods: {
		click() {
			this.$emit("click");
		},
	},
});

</script>

<template>
	<button
		class="app-pagination-button"
		:class="{ 'app-pagination-button--active': active }"
		@click="click"
	>
		<span
			class="app-pagination-button--label"
		>
			{{ label }}
		</span>
	</button>
</template>

<style scoped lang="scss">
@import 'src/styles/main.scss';

.app-pagination-button {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	border: none;
	background: transparent;

	&:hover {
		cursor: pointer;
		background: $color-background-content-primary-hovered;
	}

	&--label {
		@extend .text-body-2;
	}

	&--active {
		background: $color-image-placeholder-accent;
		color: $color-text-accent-primary;
		cursor: default;

		&:hover {
			@extend .app-pagination-button--active;
		}
	}
}

</style>


