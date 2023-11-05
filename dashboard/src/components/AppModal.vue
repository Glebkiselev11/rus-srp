<script lang="ts">
import { defineComponent, type PropType } from "vue";
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
		size: {
			type: String as PropType<"big" | "regular" | "compact">,
			default: "regular",
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
	<div
		class="app-modal-screen"
	>
		<div class="app-modal">
			<AppHeader
				:title="title"
				:subtitle="subtitle"
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
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.app-modal {
	border-radius: 16px;
	padding: 8px;
	background: $color-background-content-primary;
}

</style>
