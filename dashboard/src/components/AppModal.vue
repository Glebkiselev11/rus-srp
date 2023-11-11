<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "@/components/AppHeader.vue";

export default defineComponent({
	name: "AppModal",
	components: {
		AppHeader,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			default: null,
		},
		headerPaddingInline: {
			type: String,
			default: "16px",
		},
	},
	emits: ["close"],
	mounted() {
		this.updateBackgroundShadow();
	},
	unmounted() {
		this.updateBackgroundShadow();
	},
	methods: {
		handleClose(): void {
			this.$emit("close");
		},
		// It needs us to keep only one shadow (on last modal) for all modals
		updateBackgroundShadow() {
			const modals = document.body.querySelectorAll(".app-modal-screen");
			const className = "app-modal-screen--last-modal";
			modals.forEach((modal) => {
				modal.classList.remove(className);
			});

			const lastModal = modals[modals.length - 1];
			if (lastModal) {
				lastModal.classList.add(className);
			}
		},
	},
});

</script>

<template>
	<div
		class="app-modal-screen"
	>
		<div class="app-modal">
			<AppHeader
				:title="title"
				:subtitle="subtitle"
				:padding-inline="headerPaddingInline"
				close-button
				@close="handleClose"
			>
				<template #left>
					<slot name="header-left" />
				</template>
			</AppHeader>
			<slot name="content" />
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/styles/main.scss";

.app-modal-screen {
	position: fixed;
	z-index: 2;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&--last-modal {
		background-color: #3C495899;
	}
}

.app-modal {
	border-radius: 16px;
	padding: 8px;
	background: $color-background-content-primary;
	border: 1px solid $color-separator-primary;
	box-shadow: 0px 4px 16px 0px rgba(2, 18, 38, 0.08), 0px 0px 2px 0px rgba(2, 18, 38, 0.08);
}

</style>
