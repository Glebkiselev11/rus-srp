<script lang="ts">
import { defineComponent } from "vue";
import AppButton from "./AppButton.vue";

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
		handleClose(): void {
			this.$emit("close");
		},
	},
});
</script>

<template>
	<header class="app-header">
		<div>
			<h3>{{ title }}</h3>
			<span
				v-if="subtitle"
				class="app-header--subtitle"
				v-text="subtitle"
			/>
		</div>

		<AppButton
			v-if="closeButton"
			icon="close"
			type="inline"
			color="neutral"
			class="app-header--close-button"
			@click="handleClose"
		/>
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

	&--close-button {
		margin-inline-start: 16px;
	}

	&--subtitle {
		@extend .text-body-2;
		color: $color-text-secondary;
	}
}

</style>