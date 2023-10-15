<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AppButton from "./AppButton.vue";

type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5";

export default defineComponent({
	name: "AppHeader",
	components: {
		AppButton,
	},
	props: {
		title: {
			type: String,
			default: null,
		},
		titleTag: {
			type: String as PropType<TitleTag>,
			default: "h3",
		},
		subtitle: {
			type: String,
			default: null,
		},
		closeButton: {
			type: Boolean,
			default: false,
		},
	},
	emits: ["close"],
	methods: {
		handleClose(e: Event): void {
			e.stopPropagation();
			this.$emit("close");
		},
	},
});
</script>

<template>
	<header class="app-header">
		<div class="app-header__part-container">
			<slot name="left" />
			<div>
				<component
					:is="titleTag"
					v-if="title"
				>
					{{ title }}
				</component>

				<span
					v-if="subtitle"
					class="app-header__subtitle"
					v-text="subtitle"
				/>
			</div>
		</div>

		<div class="app-header__part-container">
			<slot name="right" />

			<AppButton
				v-if="closeButton"
				icon="close"
				type="inline"
				color="neutral"
				class="app-header__close-button"
				@click="handleClose"
			/>
		</div>
	</header>
</template>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.app-header {
	width: 100%;
	min-height: 48px;
	padding-block: 12px;
	padding-inline: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&__part-container {
		display: flex;
		align-items: center;
		column-gap: 16px;
	}

	&__close-button {
		margin-inline-start: 16px;
	}

	&__subtitle {
		@extend .text-body-2;
		color: $color-text-secondary;
	}
}

</style>
